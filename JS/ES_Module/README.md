## 前端模块化详解
### 一、认识模块化
#### 什么是模块？
- **将一个复杂的程序，根据一定的规则拆分封装为几个块，再组合到一起**
- **块内部的变量和实现方法是私有的，只向外部暴露一些接口进行通信**

#### 模块化的好处
- 避免污染全局变量，命名冲突
- 更好的分离，按需加载
- 更高复用性
- 更利于维护

#### 模块化进化方式
##### | 全局function模式
- 编码：将不同的功能封装为不同的函数
- 问题：污染全局命名空间，容易造成命名冲突，模板之间看不出依赖关系
```js
// module1.js
var data = 'module1';
function module (){
    console.log(data);
}
```
```js
// module2.js
var data = 'module2';
function module (){     // 与另一个文件中的module function产生冲突
    console.log(data);
}
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <script type="text/javascript" src="module1.js"></script>
    <script type="text/javascript" src="module2.js"></script>
    <script>
        module();       // module1中的方法被module2覆盖
    </script>
</body>
</html>
```
##### | namespace模式：简单对象封装
- 作用：减少了全局变量污染，减少了命名冲突
- 问题：不安全，数据不是私有的，内部属性可以被外部修改

```js
// module1.js
var module1 = {
    data: 'module1',
    getData(){
        return this.data;
    }
}
```
```js
// module2.js
var module2 = {
    data: 'module2',
    getData(){
        return this.data;
    }
}
```
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <script type="text/javascript" src="module1.js"></script>
    <script type="text/javascript" src="module2.js"></script>
    <script>
        module1.data = '修改后的值';
        console.log(module1);       // module1中的私有属性被修改
    </script>
</body>
</html>
```
##### | IIFE（immediately-invoked function expression）：利用匿名函数自执行形成闭包，封闭作用域
- 作用：数据是私有的。将数据和行为封装到函数内部，通过给window添加属性，向外暴露接口。
- 问题：**如何实现模块之间的依赖？**

```js
;(function () {
    // 私有变量
    var data = 1;

    // 暴露出的接口
    function getData() {
        return data;
    }

    function plus() {
        data++;
    }

    function minus() {
        data--;
    }

    // 私有方法
    function printData() {
        console.log(data);
    }


    window.module1 = {
        getData,
        minus,
        plus
    }
})()
```

##### | IIFE增强（现代模块化实现的基石）：通过传递参数实现模块之间的依赖，
- 作用：通过传参的方式，实现模块的依赖。这样做除了保证模块的独立性，还使得模块之间的依赖关系变得明显。
- 问题：**引入的js文件必须有一定顺序，一旦文件顺序改变会导致问题**


```html
<!--module1 依赖 jQuery 模块-->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Title</title>
    </head>
    <body>
        <div id="root" style="width:40px; height:40px; background: green"></div>

        <!-- 引入的js必须有一定顺序 -->
        <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js"></script>
        <script type="text/javascript" src="./module1.js"></script>
        <script>
            module1.changeDOMBk();  // 模块1依赖了jQuery
        </script>
    </body>
</html>
```
```js
;(function (window, $) {
    var data = 1;

    // 暴露出的接口
    function plus() {
        data++;
    }

    function minus() {
        data--;
    }

    function changeDOMBk() {
        $('#root')[0].style.background = 'red';
    }

    window.module1 = {
        plus,
        minus,
        changeDOMBk
    }
})(window, jQuery)
```
以上例子`module1`依赖于`jQuery`库，所以需要将`jQuery`作为参数传入（变量私有化）。这样做保证了模块之间的独立性，模块之间相互依赖的关系也很明显。

#### <font color=f42323>引入多个script产生的问题</font>
- 请求过多，浪费资源和时间
页面中`script`过多，需要发送多个请求，必定会消耗多个资源。（请求资源时间 `5 * 20Kb` > `1 * 100kb`）
- `js`必须以一定顺序引入，当模块中的依赖过多时，可能会由于文件引入顺序问题而出错。
- 由于以上两种原因，导致后期难以维护

### 二、模块化规范
可以通过模块化规范来解决以上产生的问题，所以`CommonJS -> AMD -> CMD -> UMD -> Es6 Module` 应运而生。
### 1.CommonJS【Node】
`Node`采用了`CommonJS`模块规范。 
1. 每个文件就是一个模块，每个文件有自己的作用域。在一个文件内定义的变量、函数、类都是私有的，其他文件不可见。
   每个模块只对外界暴露需要通信的接口
2. 同一文件，多次加载同一模块，模块只会加载一次，以后再加载，只会从缓存里读取结果。
3. 在服务端，文件都存储在本地，读取速度会非常快，所以模块的加载是同步的。
4. `CommonJS`模块是运行时加载，支持动态加载。
#### | 导出
可以使用`module.exports = value`或者`export.exports.name = value`导入

也可以省略`module`关键字（建议不要省略）`exports.name = value` 
##### 直接导出
```js
module.exports.name = '小红';
module.exports.age = 18;
module.exports.list = [1, 2, 3]

// 可以省略module关键字
exports.name = '小李';
exports.age = 17;

```
> 注意：如果使用`exports.name = value`导出单个值后，就不能再使用`exports = {...}`导出一个对象，会被忽略。
```js
/**
 * 注意： 单个导出值之后，再导出对象值。修改无效，最终也只是导出单个值！
 */
exports.name = '小罗';
exports.age = 24;

exports = {
    name: '小小',
    age: 18,
    sss: 0
}

// -------------- 导入 -------------

const module1 = require('./02_单个导出后导出对象');
console.log(module1); // {name: '小罗', age: 24}
```

#### | 导入
`CommonJs`中使用`require`导入，可以通过解构赋值的方法获取单个值。
```js
// module1.js
module.exports.name = '小红';
exports.age = 17;

// -------------- 导入 -------------

const {name, age} = require('./module1');
const module1 = require('./module1');
```
#### 重复导入只会加载一次
```js
let data = require("./index.js")
let data = require("./index.js") // 不会在执行了
```
git remote set-url origin https://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@github.com/luoxy0518/fe-notes.git
#### 动态导入
`CommonJS` 在其运行时执行，并非编译时执行，支持动态导入
```js
const arr = ['./01_直接导出.js','./02_单个导出后导出对象.js'];
const result = [];

arr.forEach(url => {
    result.push(require(url))
});

console.log(result); // [ { name: '小李', age: 17 }, { name: '小罗', age: 24 } ]
```
#### | 导入值是原值的浅拷贝
`CommonJs`输出的是一个值的**浅拷贝**，**注意：基本/复杂数据类型的区别**。

> 如果模块输出的值是 简单数据类型 ，模块内部 值的变化就影响不到外部使用的值。
```js
// module1.js
let name = 1;

setTimeout(() => name++, 3000);
module.exports.name = name;

// ------------- 导入 ----------------

// 简单数据类型，导出会将其复制一份，两者互不影响
const {name} = require('./module1.js');
console.log(name);      // 1

// 4000ms后又加载同一模块，因为在此文件中加载过该模块，所以不会重新加载。会从缓存中取值，取的还是第一次加载时的值：1
setTimeout(() => {
    const {name: name1} = require('./module1.js');
    console.log(name1);     // 1
}, 4000)
```
> 如果模块输出的是 复杂数据类型， 导入时的值是其原值的浅拷贝。

> 浅拷贝：
> 
> 对于对象中的第一层数据为 简单数据类型 的，复制其值，更改副本的简单数据类型不会影响原数据；
> 
> 对于对象中的第一层数据为 复杂数据类型 的，复制其引用，更改副本的复杂数据类型会影响原数据
```js
// module1.js
let name = 1;
let list= [];

module.exports = {
    name: name,
    list: list
}


setTimeout(() => {
    list.push(1);
    name++;
},3000)

// ------------- 导入 ----------------

const {list, name} = require('./module1.js');
console.log(name, list);      // 1 []

// name为简单数据类型不会影响，list为复杂数据类型由于复制的是其引用所以会相互影响
setTimeout(() => {
    const {name: name1, list: list1} = require('./module1.js');
    console.log(name1, list1);     // 1 [1]
}, 4000)

```

#### 总结
`CommonJS`解决了变量污染、文件依赖的问题。但是其模块都是同步加载，适合服务端开发，并不适合浏览器端使用。
