# Promise
尝试手写promise
## 进度
1. then => done
2. resolve => done
3. reject
4. catch
5. finally
6. all
7. race
8. allSettled
9. any
## 思路
![ing](2021-02-12-02-13-26.png)
## 测试代码
```js
const p = new MyP((resolve) => {
  const input = 2;
  console.log(`start input = ${input}`);
  setTimeout(resolve, 500, input);
});

function multiply(input) {
  return new MyP(function (resolve) {
    console.log("calculating " + input + " x " + input + "...");
    setTimeout(resolve, 500, input * input);
  });
}

function add(input) {
  return new MyP(function (resolve) {
    console.log("calculating " + input + " + " + input + "...");
    setTimeout(resolve, 500, input + input);
  });
}
p.then(multiply)
  .then(add)
  .then((result) => {
    console.log("Got value: " + result);
  });
```
## 实现代码
[MyPromise](./Promise.js)
※代码有很多没用的id追踪用,完成后删除预定

## 总结一下
1. 开头会产生Promise的实例
   1. then
   2. callback的数组/对象
   3. resolve对象
      1. 到时候去调callback的onFulfilled
      2. 通过call去让下一次执行时产生的promise的callback的onFulfilled放入下一个then的resolve
2. 下一个then产生Promise的实例
   1. 跟上面一样的省略
   2. 让之前的callback的onFulfilled代入then里面的函数
3. 实际执行的时候
   1. 执行resolve
   2. 先去调callback的onFulfilled函数 生成新的Promise实例
   3. 再通过call去让上面的Promise实例的callback的onFulfilled放入第二个Promise实例的then的resolve
   4. 这样就可以执行第二个Promise实例的callback的onFulfilled了
