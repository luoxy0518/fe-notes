## Reflect
### 概述
**`Reflect`是`ES6`新增的内置的对象**，它提供拦截`js`操作的方法，其方法与`Proxy handler`方法对应。

**`Reflect` 不是一个函数对象，因此不可以被实例化。** `Reflect`所有的方法都是静态的。

### ES6新增Reflect对象的原因
1. 在早期的`ECMA`规范中，并没有考虑到这种对 **对象本身** 的操作如何设计会更加规范，所以将很多方法放到了`Object`上。 但是对于`Object`构造函数来说，这些操作放到其身上并不合适。
2. 例如`new in delete`等等的关键字让`js`看起来有些怪异
3. 所以新增了`Reflect`对象，把对象的操作都集中到了`Reflect`上。

### Reflect的常见方法
`Reflect`中有哪些常见的方法呢？它和`Proxy`是一一对应的，也是13个：

1. **`Reflect.has(target, propertyKey)`**
    - 判断一个对象是否存在某个属性，和 `in` 运算符 的功能完全相同。
2. **`Reflect.get(target, propertyKey[, receiver])`**
    - 获取对象身上某个属性的值，类似于 `target[name]`。
3. **`Reflect.set(target, propertyKey, value[, receiver])`**
    - 将值分配给属性的函数。返回一个 `Boolean`，如果更新成功，则返回 `true`。
4. **`Reflect.deleteProperty(target, propertyKey)`**
    - 作为函数的 `delete` 操作符，相当于执行 `delete target[name]`。
5. `Reflect.getPrototypeOf(target)`
    - 类似于 `Object.getPrototypeOf()`。
6. `Reflect.setPrototypeOf(target, prototype)`
    - 设置对象原型的函数. 返回一个 `Boolean`， 如果更新成功，则返 回 `true`。
7. `Reflect.isExtensible(target)`
    - 类似于 `Object.isExtensible()`
8. `Reflect.preventExtensions(target)`
    - 类似于 `Object.preventExtensions()`。返回一个 `Boolean`。
9. `Reflect.getOwnPrope≈rtyDescriptor(target, propertyKey)`
    - 类似于 `Object.getOwnPropertyDescriptor()`。如果对象中存在 该属性，则返回对应的属性描述符, 否则返回 `undefined`.
10. `Reflect.defineProperty(target, propertyKey, attributes)`
    - 和 `Object.defineProperty()` 类似。如果设置成功就会返回 `true`
11. `Reflect.ownKeys(target)`
    - 返回一个包含所有自身属性（不包含继承属性）的数组。(类似于  `Object.keys()`, 但不会受 `enumerable` 影响).
12. `Reflect.apply(target, thisArgument, argumentsList)`
    - 对一个函数进行调用操作，同时可以传入一个数组作为调用参数。和  `Function.prototype.apply()` 功能类似。
13. `Reflect.construct(target, argumentsList[, newTarget])`
    - 对构造函数进行 `new` 操作，相当于执行` new target(...args)`。
