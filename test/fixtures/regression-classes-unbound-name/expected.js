var _createClass = function () { var defineProperties = _defineProperties; return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _defineProperties = function defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
};

let Clazz = function () {
  function Clazz() {
    _classCallCheck(this, Clazz);
  }

  _createClass(Clazz, [{
    key: "unbound",
    value: function unbound() {}
  }]);

  return Clazz;
}();