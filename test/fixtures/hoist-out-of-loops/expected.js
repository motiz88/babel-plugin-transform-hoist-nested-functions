do {
  // FIXME: This is not hoisted but probably should be
  function inner(param) {}
} while (false);

var
// NOTE: This is hoisted
_inner2 = function inner(param) {};

(function () {
  var inner = _inner2;

  do {} while (false);
})();

var
// NOTE: This is hoisted
_deepInner = function deepInner(deepParam) {};

do {
  // FIXME: This is not hoisted but probably should be
  function inner(param) {
    var deepInner = _deepInner;
  }
} while (false);

for (;;) {
  // FIXME: This is not hoisted but probably should be
  function inner(param) {}
}

var
// NOTE: This is hoisted
_inner3 = function inner(param) {};

(function () {
  var inner = _inner3;

  for (;;) {}
})();

var
// NOTE: This is hoisted
_deepInner2 = function deepInner(deepParam) {};

for (;;) {
  // FIXME: This is not hoisted but probably should be
  function inner(param) {
    var deepInner = _deepInner2;
  }
}