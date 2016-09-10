class A {
  render() {
    return <State initial={0}>
      {
        // NOTE: hoisted
        (val, set) => 
          <div onClick={
            // NOTE: not hoisted
            () => set(val + 1)
          }>  
            clicked {val} times
          </div>
      }
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
        (val, set) =>
          <div onClick={
            // NOTE: not hoisted
            () => set(val + 1)
          }>  
            {localClicked} {val} times
          </div>
      }
    </State>;
  }
}

class C {
  render() { 
    return <State initial={0}>
      {
        // NOTE: not hoisted
        (val) =>
          <div onClick={
            // NOTE: not hoisted
            () => this.set(val + 1)
          }>
            clicked {val} times
          </div>
      }
    </State>;
  }

  set() {}
}
