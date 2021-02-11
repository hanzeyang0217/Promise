let id = 0;
function MyPromise(executor) {
  let state = "pending";
  let value = null;
  id++;
  this.id = id;
  const callbacks = {
    callbacks: null,
    id: id,
  };
  this.then = (onFulfilled) => {
    return new MyPromise((resolve) => {
      handle({
        onFulfilled: onFulfilled,
        resolve: resolve,
      });
    });
  };

  const handle = (callback) => {
    if (state === "pending") {
      callbacks.callbacks = callback;
      return;
    }
    const ret = callback.onFulfilled(value);
    callback.resolve(ret);
  };
  handle.id = id;
  const resolve = (newValue) => {
    if (
      newValue &&
      (typeof newValue === "object" || typeof newValue === "function")
    ) {
      if (typeof newValue.then === "function") {
        newValue.then.call(newValue, resolve);
        return;
      }
    }
    state = "fulfilled";
    value = newValue;
    if (callbacks.callbacks) {
      handle(callbacks.callbacks);
    }
  };
  resolve.id = id;
  executor(resolve);
}

const p = new MyPromise((resolve) => {
  const input = 2;
  console.log(`start input = ${input}`);
  setTimeout(resolve, 500, input);
});

function multiply(input) {
  return new MyPromise(function (resolve) {
    console.log("calculating " + input + " x " + input + "...");
    setTimeout(resolve, 500, input * input);
  });
}

function add(input) {
  return new MyPromise(function (resolve) {
    console.log("calculating " + input + " + " + input + "...");
    setTimeout(resolve, 500, input + input);
  });
}

p.then(multiply)
  .then(add)
  .then((result) => {
    console.log("Got value: " + result);
  });
