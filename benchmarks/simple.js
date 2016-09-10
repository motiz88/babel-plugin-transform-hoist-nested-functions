let x;

module.exports = function () {
  trampoline(function inner (param) {
    x = 2 * param;
  });
  return x;
};

function trampoline (fn) {
  fn(Math.random());
}
