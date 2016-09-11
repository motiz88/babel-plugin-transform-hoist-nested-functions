const _hoistedMethod = new Symbol('_hoistedMethod');

var
// NOTE: hoisted
_hoistedAnonymousFunc2 = (val, set) => <div onClick={
// NOTE: not hoisted
() => set(val + 1)}>  
            clicked {val} times
          </div>;

class A {
  render() {
    return <State initial={0}>
      {_hoistedAnonymousFunc2}
    </State>;
  }
}

class B {
  render() {
    // NOTE: The use of a captured variable blocks hoisting out of render() 
    const localClicked = 'clicked';
    return <State initial={0}>
      {
      // NOTE: not hoisted
      (val, set) => <div onClick={
      // NOTE: not hoisted
      () => set(val + 1)}>  
            {localClicked} {val} times
          </div>}
    </State>;
  }
}

class C {
  [_hoistedMethod] =
  // NOTE: hoisted to bound bethod
  val => <div onClick={
  // NOTE: not hoisted
  () => this.set(val + 1)}>
            clicked {val} times
          </div>;

  render() {
    return <State initial={0}>
      {this[_hoistedMethod]}
    </State>;
  }

  set() {}
}