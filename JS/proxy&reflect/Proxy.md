## Proxy
### Object.defineProperty()
`ES6`之前，可以使用`Object.defineProperty(target, prop, descriptor)`的存储描述符(`getter/setter`)监听对象的赋值、获取值操作。
#### 缺点
1. `Object.definePropery()`的设计初衷，并不是用来监听对象操作的`API`
2. 无法拦截对象属性的删除、新增

### ES6诞生Proxy
**`Proxy`是一个类**，通过实例化，帮我们创建一个代理，实现监听功能。

#### 参数
- `target` 监听的原对象
- `handler` 对应的处理对象

#### 使用
1. 我们需要监听`obj`对象，**使用`new Proxy`创建其对应的代理对象**
2. **之后对原对象的所有操作，都通过代理对象完成**
3. 代理对象具有监听对象操作的功能，其监听的动作是在`handler`中完成的
```js
// 原对象
const obj = {};
// 实例化，创建其代理对象
const p1 = new Prxoy(obj, {
    // 监听原对象的取值操作
    get(target, prop, receiver){
        return Reflect.get(target, prop);
    },
    // 监听原对象的赋值操作
    set(target, prop, val, receiver){
        return Reflect.set(target, prop, val)
    }
});

p1.name = 'lucy';
console.log(p1.name);
```
≈

#### Proxy应用于函数对象 construct apply
`proxy`也可以用于函数对象，监听函数的某些操作。

- `handler.apply()` 监听函数被调用
- `handler.construct()` 监听函数被实例化
```js
function foo(a, b){
    this.a = a;
    this.b = b;
    console.log('我执行了')
}

const fooProxy = new Proxy(foo, {
    apply(target, thisArg, argumentsList){
        console.log('函数被调用');
        return foo();
    },
    construct(target, argumentslist, newTarget){
        console.log('函数被实例化');
        return new foo(...argumentslist);
    }
});

fooProxy(1,2);
// 函数被调用
// 我执行了
new fooProxy(1,2);
// 函数被实例化
// 我执行了
```
