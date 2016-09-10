(async function () {
  // NOTE: hoisted
  async function inner() {}
  return inner;
})();

(async function () {
  return inner;
  // NOTE: hoisted
  async function inner() {}
})();

(async function () {
  // NOTE: hoisted
  return async function inner() {};
})();

(async function () {
  // NOTE: hoisted
  return async function () {};
})();

(async function () {
  // NOTE: hoisted
  return async () => {};
})();

(async function () {
  // NOTE: hoisted
  const x = async () => {};
  return x;
})();
