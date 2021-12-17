## Promise

`promise`将异步操作**队列化**，按照期望的顺序执行。解决多个异步操作依次执行的需求，可以通过链式调用多个`promise`达到目的。
`promise`解决了：回调地狱的不易读和维护的问题。
> `Promise`是一个拥有`then`方法的对象或函数。

### 异步状态

`promise`可以理解为承诺。就像我们去饭店吃饭，服务员给我们一张取餐票，告诉我们饭好了来取，这就是承诺。如果餐做好了，就是成功状态；如果无法出参，就是失败状态。

- 一个`promise`必须有一个`then`方法用于处理状态改变后的结果。

#### 状态说明

`Promise`有三种状态，`pending`、`fulfilled`、`rejected`。
`Promise`是生产者，通过其内置的`resolve/reject`函数告知消费者其结果。
**`promise`的结果一旦确定后不可更改！**

- `pending`: 初始化`promise`等待状态，即没有被兑现，也没有被拒绝。
- `fulfilled`: `promise`成功状态，通过`resolve(val)`传递成功值。
- `rejected`: `promise`失败状态，通过`reject(err)`传递失败值。

`promise`创建时立即执行同步代码。`.then`、`.catch`、`.finally`会放在异步微任务中执行，需要等所有同步代码执行后才执行。

```js
const promise = new Promise(resolve => resolve("success"));
promise.then(alert);
alert("houdunren.com");
promise.then(() => {
    alert("后盾人");
});

// 1.输出houdunren.com
// 2.输出success
// 3.输出后盾人
```

`Promise`的状态一旦发生改变，其状态将会固化，无法再改变。

```js
new Promise((resolve, reject) => {
    resolve("操作成功");
    reject(new Error("请求失败"));
}).then(
    msg => {
        console.log(msg);
    },
    error => {
        console.log(error);
    }
);
// 当前promise的状态已经为fulfilled，已经无法使用reject更改其状态。
// 只会输出： 操作成功
```

#### 动态改变promise状态

如果 `resolve` 参数是一个 `promise` ，将会改变 `promise` 状态。

```js
const p2 = new Promise((resolve) => {
    setTimeout(() => {
        resolve('success');
    })
});

const p1 = new Promise((resolve) => {
    resolve(p2);
});

p1.then((val) => {
    console.log(val);
});

// 此时 p1 返回了 p2,所以 P1本身的状态已经没有意义了，后面的then是对p2的处理
```

- 因为 `p1` 的 `resolve` 返回了 `p2` 的 `promise`，所以此时 `p1` 的 `then` 方法已经是 `p2` 的了
- 正因为以上原因 `then` 的第一个函数输出了 `p2` 的 `resolve` 的参数

### Promise.prototype.then()

一个`promise`需要提供一个`then`方法用于处理`promise`的结果，无论是成功还是失败。

#### 语法说明

```js
p1.then(onFulfilledFn, onRejectedFn);
```

- `.then`最多接收**两个函数**作为参数
    - `onFulfilledFn`：在`promise`状态变为成功时被调用
    - `onRejectedFn`：在`promise`状态变为失败时调用
- **当`.then`的参数不是函数时，不会报错，但是会被忽略。【promise的透传】**
- 当创建一个`promise`实例时，`.then` 中的代码会被注册到微任务队列中，当`promise`的状态发生改变时，由当前的线程循环来调度完成。

【promise透传】，当`then`的参数为非函数，其会被忽略，值会一直向后传递。

```js
new Promise((resolve) => {
    resolve(1);
})
    .then()
    .then(3)
    .then(6)
    .then((val) => {
        console.log(val); // 1
    });

// 由于then的参数一直不符合规范，所以参数一直被透传，最终输入1
```

```js
new Promise((resolve, reject) => {
    reject('error');
})
    .then(() => {
        console.log('success');
    }, 3)
    .then()
    .then(null, (err) => {
        console.log(err);  // error
    })

```

#### 链式调用

- 每个`.then`会返回一个**新的**`promise`，**默认**`.then`返回的`promise`的状态是`fulfilled`。不要认为上一个 `promise` 状态会影响以后 `then` 返回的状态。

```
const p1 = new Promise((resolve, reject) => {
    reject('error')
}).then(null, () => {
    return 1;
});

console.log(p1); // Promise{<fulfilled>}
```

```js
let p1 = new Promise(resolve => {
    resolve();
});
let p2 = p1.then(() => {
    console.log("后盾人");
});
p2.then(() => {
    console.log("houdunren.com");
});
console.log(p1); // Promise {<fulfilled>}
console.log(p2); // Promise {<pending>}
```

- 当`.then`中返回的为`promise`类型时，下一个`.then`需要在当前返回的`promise`状态发生改变后，再执行。

```js
new Promise((resolve) => {
    setTimeout(() => {
        resolve('success');
    }, 1000);
})
    .then(val => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(val), 1000);
        })
    })
    .then((val) => {
        console.log(val); // 2000ms后输出success
    })
// 由于第一个then中返回了一个promise，所以第二个then要等待第二个Promise状态改变后再执行。
```

#### 其他知识点

##### 循环调用

`.then`返回相同的`promise`将禁止执行

```js
const p1 = new Promise((resolve) => {
    resolve(1);
}).then(val => {
    return p1; //   TypeError: Chaining cycle detected for promise #<Promise>
})
```

##### Thenables

- **包含`then`方法**的对象，就是一个`promise`，系统将传递`resolve reject`作为参数。
- 如果方法中的`then`不是一个方法，则此对象将会被当成普通对象处理。

```js
new Promise((resolve, reject) => {
    resolve({
        then(resolve, reject) {
            resolve(1000);
        }
    })
})
    .then(val => {
        return {
            then(resolve, reject) {
                resolve(val * 2);
            }
        }
    })
    .then(val => console.log(val, 'val'));  // 2000
```

### catch

`.catch`用于失败状态时的处理函数，等同于`.then(null, onRejectedFn)`

- 建议使用`.catch`处理错误。
- 可以将`.catch`放在最后面统一处理前面发生的错误。

- `catch`中如果没有错误，其`return`值会在下一个成功的回调中获取到。

```js
const promise = new Promise((resolve, reject) => {
    reject(new Error("Notice: Promise Exception"));
});
promise.catch(msg => {
    console.error(msg);
});
```

#### 错误是冒泡机制

如果发生错误，是冒泡的机制，会一直冒泡到`.catch`处理函数，如果没有对应的错误处理，将会报错。

```js
new Promise((resolve, reject) => {
    reject(new Error("请求失败"));
})
    .then(msg => {
    })
    .then(msg => {
    })
    .catch(error => {
        console.log(error);
    });
```

#### catch捕捉其他错误

`catch`也可以捕获其他的错误，例如：未定义变量等等。

```js
new Promise(() => {
    console.log(a);
}).catch(err => {
    console.log(err);   //  ReferenceError: a is not defined
                        //  at promise.js:103
                        //  at new Promise (<anonymous>)
                        //  at promise.js:102
})
```

#### catch无法捕捉异步中产生的错误

```js
new Promise(() => {
    setTimeout(() => {
        console.log(a);
    }, 3000);
}).catch(err => {
    console.log(a); // 捕捉不到错误，并且控制台报错
});

// 控制台报错
```

#### unhandledrejection处理未捕获的错误

可以使用`unhandledrejection`处理未捕获的错误，不包括异步任务。

```js
window.addEventListener("unhandledrejection", function (event) {
    console.log(event.promise); // 产生错误的promise对象
    console.log(event.reason); // Promise的reason
});
```

### finally

无论状态是成功或失败，一旦改变状态，就会执行`finally`函数，`finally`函数与状态无关。

```js
const promise = new Promise((resolve, reject) => {
    reject("hdcms");
})
    .then(msg => {
        console.log("resolve");
    })
    .catch(msg => {
        console.log("reject");
    })
    .finally(() => {
        console.log("resolve/reject状态都会执行");
    });
```

`finally`中的函数没有任何参数，执行后会将promise的值继续传递。

```js
const p1 = new Promise((resolve, reject) => {
    resolve('1');
});
p1.finally(() => {
    console.log('输出finally');
    return '2'; // finally的返回值会被忽略
}).then(val => {
    console.log(val);   // 1
})
```

### 扩展接口

#### Promise.resolve

使用`Promise.resolve`方法可以快速的返回一个`promise`对象。如果是`thenable`对象，会将其包装。

```js
Promise.resolve("后盾人").then(value => {
    console.log(value); //后盾人
});

// thenable
const hd = {
    then(resolve, reject) {
        resolve("后盾人");
    }
};
Promise.resolve(hd).then(value => {
    console.log(value);
});
```

##### 使用场景

对`ajax`做请求，如果缓存中有数据，使用缓存数据不调用接口。

```js
function query(name) {
    const cache = query.cache || (query.cache = new Map());
    if (cache.has(name)) {
        console.log("走缓存了");
        return Promise.resolve(cache.get(name));
    }
    return ajax(`http://localhost:8888/php/user.php?name=${name}`).then(
        response => {
            cache.set(name, response);
            console.log("没走缓存");
            return response;
        }
    );
}

query("1").then(response => {
    console.log(response);
});
setTimeout(() => {
    query("1").then(response => {
        console.log(response);
    });
}, 1000);
```

#### Promise.reject()

与`Promise.resolve()`相似，快速生层一个失败的`promise`。

```js
Promise.reject(1).then(null, (err) => console.log(err));    // 1

// 使用Promise.reject改变状态
new Promise(resolve => {
    resolve("后盾人");
})
    .then(v => {
        if (v != "houdunren.com") return Promise.reject(new Error("fail"));
    })
    .catch(error => {
        console.log(error);
    });
```

#### Promise.all(iterable)
使用`Promise.all()`可以同时执行多个并行的异步操作，例如页面加载时获取课程列表和收藏课程列表。

- 其参数必须是可迭代对象（具有[Symbol.iterable]接口）：`Array`/`Map`/`Set`。迭代对象中的值，如果不是`promise`时，默认会被`Promise.resolve()`包裹。
- 其中任何一个`promise`失败，都会立即调用`catch`方法，且`reject`是第一个抛出的错误信息。
- 成功后返回一个`promise`实例，其成功的回调值是由所有`promise`的`resolve`回调组成的。

```js
const p1 = Promise.reject(1);
const p2 = Promise.resolve(1);
const p3 = Promise.resolve(1);
const p4 = Promise.resolve(1);

Promise.all([p2, p3, p4]).then(res => {
    console.log(res);   // [1, 1, 1]
});

Promise.all([p1, p2, p3, p4]).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);   // 1000
});
```
#### Promise.allSettled(iterable)
`allSettled`用于处理多个`promise`，只关注完成，**不关注其成功或失败状态，`allSettled`状态只会是`fulfilled`**。
```js
const p1 = new Promise((resolve, reject) => {
  resolve("resolved");
});
const p2 = new Promise((resolve, reject) => {
  reject("rejected");
});
Promise.allSettled([p1, p2])
.then(msg => {
  console.log(msg);
})
```
![img.png](img.png)

#### Promise.race(iterable)
使用`Promise.race()`处理容错异步，返回一个promise实例，以最快的那个`promise`为准。
```js
// 示例，接口2000ms没有返回结果，报错"request fail"
const api = "http://localhost:8888/php";
const promises = [
  ajax(`${api}/user.php?`),
  new Promise((a, b) =>
    setTimeout(() => b(new Error("request fail")), 2000)
  )
];
Promise.race(promises)
.then(response => {
  console.log(response);
})
.catch(error => {
  console.log(error);
});
```
