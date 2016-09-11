import plugin from '../src';
import merge from 'deep-assign';

const PLUGIN_NAME = require('../package.json').name;

function pluginNameNormalize (s) {
  if (typeof s !== 'string') return s;
  return s.replace(/^babel-plugin-/, '');
}

function pluginNameMatch (s1, s2) {
  const result = pluginNameNormalize(s1) === pluginNameNormalize(s2);
  return result;
}

export default (options) => {
  const merged = merge({}, {babelrc: false}, options || {});
  if (merged.plugins) {
    const i = merged.plugins
      .findIndex(optPlugin =>
        pluginNameMatch(optPlugin, PLUGIN_NAME) ||
        (optPlugin === plugin) ||
        (Array.isArray(optPlugin) && (
          pluginNameMatch(optPlugin[0], PLUGIN_NAME) ||
          (optPlugin[0] === plugin)))
      );
    if (i === -1) {
      merged.plugins.unshift(plugin);
    } else {
      if (Array.isArray(merged.plugins[i])) {
        merged.plugins[i][0] = plugin;
      } else {
        merged.plugins[i] = plugin;
      }
    }
  } else {
    merged.plugins = [plugin];
  }
  return merged;
};
