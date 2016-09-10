(function () {
  // NOTE: hoisted
  function inner() {}
  return inner;
})();

(function () {
  return inner;
  // NOTE: hoisted
  function inner() {}
})();

(function () {
  // NOTE: hoisted
  return function inner() {};
})();

(function () {
  // NOTE: hoisted
  return function () {};
})();

(function () {
  // NOTE: hoisted
  return () => {};
})();

(function () {
  // NOTE: hoisted
  const x = () => {};
  return x;
})();
