/**
 * - 对比./es与antd/es目录差异
 * - 导出src中不存在的组件
 */
const path = require('path');
const fs = require('fs');

const excludes = ['_util', 'locale', 'locale-provider', 'style'];

const template = {
  es: `import DefaultComponent from '{{PATH}}';
export * from '{{PATH}}';
export default DefaultComponent;
  `,
  lib: `"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;
  
var _component = _interopRequireWildcard(require("{{PATH}}"));
  
Object.keys(_component).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _component[key];
    }
  });
});
  
function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }
  
function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
  
var _default = _component.default;
exports.default = _default;`,
  'es-style': `import '{{PATH}}'`,
  'lib-style': `"use strict";

require("{{PATH}}");`,
};

function exists(src) {
  try {
    fs.accessSync(src, fs.constants.F_OK);
  } catch (err) {
    return false;
  }
  return true;
}

function genStyleFile(componentName, dest, mode) {
  fs.writeFileSync(
    path.join(dest, 'index.js'),
    template[`${mode}-style`].replace(/{{PATH}}/g, `antd/${mode}/${componentName}/style`),
    'utf-8',
  );
}

function genFile(src, dest, mode) {
  const files = fs.readdirSync(src);

  files.forEach(function (fileName) {
    const _src = `${src}/${fileName}`;
    const _dest = `${dest}/${fileName}`;
    const stats = fs.statSync(_src);

    const matched = _src.match(/\/antd\/(es|lib)\/(\S*?)(\/|$)/);
    let componentName;
    let mode;
    if (matched && matched.length > 2) {
      componentName = matched[2];
      mode = matched[1];
    }

    if (stats.isFile() && !exists(_dest)) {
      const fileNameWithoutExt = fileName.split('.')[0];
      const ts = _dest.endsWith('.d.ts');
      fs.writeFileSync(
        _dest,
        template[ts ? 'es' : mode].replace(
          /{{PATH}}/g,
          `antd/${mode}/${componentName}/${fileNameWithoutExt}`,
        ),
        'utf-8',
      );
    } else if (
      stats.isDirectory() &&
      !exists(_dest) &&
      !excludes.some((name) => _src === path.join(__dirname, '../node_modules/antd/', mode, name))
    ) {
      // 处理style目录文件
      if (_src === path.join(__dirname, '../node_modules/antd/', mode, componentName, 'style')) {
        fs.mkdirSync(_dest);
        genStyleFile(componentName, _dest, mode);
      } else {
        genDirectory(_src, _dest);
      }
    }
  });
}

function genDirectory(src, dest) {
  try {
    fs.accessSync(dest, fs.constants.F_OK);
  } catch (err) {
    fs.mkdirSync(dest);
  }
  genFile(src, dest);
}

genDirectory(path.join(__dirname, '../node_modules/antd/es'), path.join(__dirname, '../es'));
genDirectory(path.join(__dirname, '../node_modules/antd/lib'), path.join(__dirname, '../lib'));
