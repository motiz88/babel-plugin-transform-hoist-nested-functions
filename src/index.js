/* @flow */

import type { NodePath, Scope } from 'babel-traverse';

class InnerScopeVisitor {
  referencedScopes: Scope[];
  seenThisExpression: boolean;

  ReferencedIdentifier = (path: NodePath) => {
    const binding = path.scope.getBinding(path.node.name);
    if (binding) {
      if (!this.referencedScopes) {
        this.referencedScopes = [];
      }
      this.referencedScopes.push(binding.scope);
    }
  }

  ThisExpression = (path: NodePath) => {
    this.seenThisExpression = true;
  }
}

function uniqueScopes (scopes: Scope[]): Scope[] {
  return scopes
    .sort((a, b) => (a.uid - b.uid))
    .reduce((a, x) => (a.length && a[a.length - 1].uid === x.uid) ? a : a.concat(x), []);
}

function deepestScopeOf (path: NodePath, scopes: Scope[]): ?Scope {
  let scope = path.scope;
  do {
    if (scopes.indexOf(scope) !== -1) {
      return scope;
    }
  } while (scope = scope.parent); // eslint-disable-line no-cond-assign
}

type BabelVisitors = {
  [key: string]: (path: NodePath) => void
};

type BabelPlugin = {
  visitor?: BabelVisitors
};

export default function ({types: t, template}: {types: BabelTypes, template: BabelTemplate}): BabelPlugin {
  const declarationTemplate = template(`
    var NAME = VALUE;
  `);
  return {
    visitor: {
      Function (path: NodePath) {
        if (t.isProgram(path.scope.parent.block)) {
          // Nowhere we can move this function
          return;
        }
        if (path.getData('unhoistable')) return;
        // Determine the outermost scope we can move to,
        // which is the innermost scope we are actually referencing (if any),
        // or the global scope.
        const innerScope = new InnerScopeVisitor();
        path.traverse(innerScope);
        if (innerScope.seenThisExpression && t.isArrowFunctionExpression(path.node)) return;
        const referencedScopes = uniqueScopes(innerScope.referencedScopes || []);
        const targetScope = deepestScopeOf(
          path,
          referencedScopes
            .concat(path.scope.getProgramParent())
            .filter(scope => scope !== path.scope)
         );
        if (!targetScope || targetScope === path.scope.parent) {
          return;
        }
        if (path.node.id) {
          const binding = path.scope.getBinding(path.node.id.name);
          const isUnsafeUse = usePath => {
            if (usePath.parent.type !== 'MemberExpression') return false;
            if (usePath.key !== 'object') return false;
            while (usePath = usePath.parentPath) { // eslint-disable-line no-cond-assign
              if (usePath.parent.type === 'UpdateExpression' && usePath.key === 'argument') {
                return true;
              }
              if (usePath.parent.type === 'AssignmentExpression' && usePath.key === 'left') {
                return true;
              }
              if (usePath.node === path.node) {
                break;
              }
              if (!t.isLVal(usePath.node)) {
                break;
              }
            }
            return false;
          };
          const uses = binding.referencePaths
            .filter(refPath => refPath !== path && t.isIdentifier(refPath));

          if (uses.length) {
            if (uses.some(isUnsafeUse)) {
              return;
            }
          }
        }

        // FunctionDeclaration needs some extra processing to be compatible with Babel's hoister:
        // 1) Replace the node with a VariableDeclaration initialized with a FunctionExpression.
        // 2) Invoke hoist() on the expression.
        // 3) Hoist the declaration itself within its block so the function is correctly available
        //    even before its original point of declaration.

        let declaratorPath: ?NodePath = null;
        let declaratorBackupNode: ?BabelNode = null;
        if (t.isFunctionDeclaration(path.node)) {
          declaratorPath = path;
          declaratorBackupNode = declaratorPath.node;
          path.replaceWith(
            declarationTemplate(
              {
                NAME: path.node.id,
                VALUE: Object.assign({}, path.node, {type: 'FunctionExpression'})
              }
            )
          );
          path = declaratorPath.get('declarations.0.init');
        }

        // Babel's hoister will give the outer declaration a meaningless id like "_ref" :(
        // We generate a meaningful one instead, and we do it *before* hoisting so as to completely
        // ignore the hoister's id (in case ours happen to collide with it).
        const id = targetScope.generateUidIdentifierBasedOnNode(path.node.id || path.node, 'hoistedAnonymousFunc');
        path.hoist(targetScope);
        // fix up the temporary hoisted name to our meaningful id
        const tempName: string = path.node.name;
        if (!tempName) {
          // hoisting did not succeed
          if (declaratorBackupNode && declaratorPath) {
            declaratorPath.setData('unhoistable', true);
            declaratorPath.replaceWith(declaratorBackupNode);
          }
          return;
        }
        targetScope.crawl(); // so the next line can find the newly inserted binding
        const tempBinding = path.scope.getBinding(tempName);
        tempBinding.path.get('id').replaceWith(id);
        path.replaceWith(id);
        path.scope.crawl(); // so we see the renamed reference in further processing
        tempBinding.path.scope.crawl(); // so the scope holding the temp binding is fully updated too

        // fix up the inner VariableDeclarator's position
        if (declaratorPath) {
          const { node } = declaratorPath;
          declaratorPath.remove();
          declaratorPath.scope.getFunctionParent().path.get('body').unshiftContainer('body', node);
        }
      }
    }
  };
}
