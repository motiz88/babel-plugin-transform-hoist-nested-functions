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

(class {
  outer() {
    // FIXME: unsafely hoisted
    const inner = () => {};
    inner.someProp = 1;
  }
});

(class {
  outer() {
    // NOTE: hoisted to bound method
    const inner = () => this.constructor.name;
    inner.name;
  }
});
