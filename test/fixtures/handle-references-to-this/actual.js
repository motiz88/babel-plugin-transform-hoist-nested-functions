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
  // NOTE: hoisted
  return () =>
    // NOTE: hoisted
    function B () {
      return this;
    };
})();

// NOTE: not hoisted
() => this;
