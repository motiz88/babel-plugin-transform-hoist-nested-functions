(function () {
  // NOTE: not hoisted
  function inner(param) {}
  inner.someProp++;
})();

(function () {
  // NOTE: hoisted
  function inner(param) {}
  return inner.name;
})();

(function () {
  function inner(param) {}
  // NOTE: not hoisted
  inner.someProp = 1;
})();

(function () {
  // NOTE: hoisted
  function inner(param) {}
  
  var dummy = {};
  return dummy[inner];
})();

(function () {
  // NOTE: hoisted
  function inner(param) {}
  inner;
})();

(function () {
  // NOTE: hoisted
  function inner(param) {}
  inner.name;
})();
