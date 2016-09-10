(function * () {
  // NOTE: hoisted
  function * inner() {}
  return inner;
})();

(function * () {
  return inner;
  // NOTE: hoisted
  function * inner() {}
})();

(function * () {
  // NOTE: hoisted
  return function * inner() {};
})();

(function * () {
  // NOTE: hoisted
  return function * () {};
})();
