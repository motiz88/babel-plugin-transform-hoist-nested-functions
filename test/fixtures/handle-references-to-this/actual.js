(function () {
  // NOTE: not hoisted
  return () => this;
})();

class A {
    method() {
      // FIXME: not hoisted but we could make it a "private" method
      return () => this;
    }
}

(function A () {
  // FIXME: We are too conservative regarding "this" in arrow functions.
  // The arrow func here is not hoisted due to the embedded ThisExpression,
  // but it's actually safe because A's "this" is not referenced.
  // This is made even more apparent by the fact that B itself is (correctly)
  // hoisted, taking the ThisExpression along with it.
  return () => function B () {return this};
})();
