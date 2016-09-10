do {
  // FIXME: This is not hoisted but probably should be
  function inner(param) {}
} while (false);

(function () {
  do {
    // NOTE: This is hoisted
    function inner(param) {}
  } while (false);
})();

do {
  // FIXME: This is not hoisted but probably should be
  function inner(param) {
    // NOTE: This is hoisted
  	function deepInner(deepParam) {}
  }
} while (false);

for (;;) {
  // FIXME: This is not hoisted but probably should be
  function inner(param) {}
}

(function () {
  for (;;) {
    // NOTE: This is hoisted
    function inner(param) {}
  }
})();

for (;;) {
  // FIXME: This is not hoisted but probably should be
  function inner(param) {
    // NOTE: This is hoisted
  	function deepInner(deepParam) {}
  }
}