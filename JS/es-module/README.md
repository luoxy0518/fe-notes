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
#### | 1.全局function模式：将不同的功能封装为不同的函数
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
#### | 2. namespace模式：简单对象封装
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
#### | 3. IIFE（immediately-invoked function expression）：利用匿名函数自执行形成闭包，封闭作用域
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

#### | 4. IIFE增强（现代模块化实现的基石）：通过传递参数实现模块之间的依赖，
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
页面中`script`过多，需要发送多个请求，必定会消耗多个资源。（请求资源时间： `5 个 20Kb 的文件` > `1 个 100kb 的文件`）
- `js`必须以一定顺序引入，当模块中的依赖过多时，可能会由于文件引入顺序问题而出错。
- 由于以上两种原因，导致后期难以维护

---

### 二、模块化规范
可以通过模块化规范来解决以上产生的问题，所以`CommonJS -> AMD -> CMD -> UMD -> Es6 Module` 应运而生。
### 1.CommonJS【Node】
`Node`采用了`CommonJS`模块规范。 
1. 每个文件就是一个模块，每个文件有自己的作用域。在一个文件内定义的变量、函数、类都是私有的，其他文件不可见。
   每个模块只对外界暴露需要通信的接口
2. **同一文件，多次加载同一模块，模块只会加载一次，以后再加载，只会从缓存里读取结果。**
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
// module1.js
exports.name = '小罗';
exports.age = 24;

exports = {
    name: '小小',
    age: 18,
    sss: 0
}

// -------------- 导入 -------------

const module1 = require('./module1.js');
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
> 对于对象中的第一层数据为 简单数据类型 -> 更改副本的简单数据类型 -> 不会影响原数据；
> 
> 对于对象中的第一层数据为 复杂数据类型 -> 更改副本的复杂数据类型 -> 会影响原数据
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

---

### 2.AMD（Asynchronous Module Definition）异步模块加载规范
- `CommonJS`规范加载模块是同步的，代表着加载模块时会阻塞后续操作，此机制只适用于服务端。  
- **`AMD`为异步模块加载机制，适用于浏览器环境，从服务端加载模块，采用异步模式更加合理，因此浏览器一般采用`AMD`规范。**  
- `RequireJS`库主要用于用户端的客户管理。其模块 管理遵守`AMD`规范。  

**`RequireJS`的基本思想是，通过`define`方法，将代码定义为模块；通过`require`方法，实现代码的模块加载。**
#### 使用RequireJS
引入`RequireJS`: `<script data-main="./main.js"  src="https://cdn.bootcdn.net/ajax/libs/require.js/2.3.6/require.js"></script>
`
以上的`data-main`属性不可缺省，其代表整个项目的入口`js`文件。
#### | 定义模块
`define`方法用于定义模块，`RequireJS`要求一个模块放在一个单独的文件内。
##### （1）定义独立模块
如果被定义的模块是一个独立模块，不需要依赖任何其他模块，可以直接用`define`方法生成。
```js
// module1.js
// 此模块没有依赖
define(function () {
    let count = 0;

    function add() {
        count++;
    }

    // 模块导出，可以是任何类型
    return {add, count}
})
```
##### （2）定义非独立对象
如果定义的模块需要依赖其他模块，则须采用以下的写法定义模块：
1. `define`方法接收的第一个参数： 依赖组成的数组
2. 第二个参数为：当依赖加载完毕，执行的回调函数。它的**参数与依赖数组的顺序必须一一对应**
```js
// 此模块依赖module1
define(['./module1'], function(m1){
    return m1.count;
});
```
当依赖过多时，写成这种方式会显得非常麻烦：
```js
define(
    [       'dep1', 'dep2', 'dep3', 'dep4', 'dep5', 'dep6', 'dep7', 'dep8'],
    function(dep1,   dep2,   dep3,   dep4,   dep5,   dep6,   dep7,   dep8){
        ...
    }
);
```
为了解决以上的问题，`RequireJS`提供了一种更清晰的写法：
```js
define(function(require){
    const d1 = require('./d1');
    const d2 = require('./d2');
    const d3 = require('./d3');
    const d4 = require('./d4');
    
    return {d1, d2, d3, d4}
})
```
#### | 调用模块
`require`方法用于调用模块。它的参数与`define`方法类似。（写在主文件内？）
```js
require(['foo', 'bar'], function ( foo, bar ) {
        foo.doSomething();
});
```

#### 总结
使用`define`与`require`两个方法定义和调用模块的方法，合称为`AMD`模式。通过`AMD`模式定义模块：
1. 不会污染全局环境
2. 清楚的显示了模块间的依赖关系
3. 减少了`<script>`，减少资源消耗、节省时间

`AMD`模式可以用于浏览器环境，并且**允许非同步加载模块**，也**可以根据需要动态加载模块**。

---

### 3.CMD (Common Module Definition)
`CMD`是在`AMD`基础上改进的一种规范，和`AMD`不同在于对依赖模块的执行时机处理不同，`CMD`是就近依赖，而`AMD`是前置依赖。  
- `AMD`推崇前置依赖：依赖必须一开始就写好，会先尽早的执行（依赖）模块，所有的`require`都会被提前执行。
- `CMD`推崇就近依赖：什么时候`require`，什么时候模块再加载，实现了懒加载（延时加载）  

`CMD`主要用于客户端，模块的加载是异步的，模块使用时才会执行。`Sea.js`中，所有模块都遵循`CMD`模块定义。
#### | 定义模块
##### (1) 定义没有依赖的模块
```js
//定义没有依赖的模块
define(function(require, exports, module){
    exports.xxx = value
    module.exports = value
})
```
##### （2）定义有依赖的模块
```js
//定义有依赖的模块
define(function(require, exports, module){
  //引入依赖模块(同步)
  var module2 = require('./module2')
  //引入依赖模块(异步)
    require.async('./module3', function (m3) {})
  //暴露模块
  exports.xxx = value;
})
```
##### 使用模块
```js
define(function (require) {
  var m1 = require('./module1')
  var m4 = require('./module4')
  m1.show()
  m4.show()
})
```
#### | 简单使用CMD（Sea.js）
```js
// main.js
define(function (require, exports, module) {
    const {addCount, getCount} = require('./module1');
    addCount();
    addCount();
    addCount();

    const count = getCount();
    console.log(count);
})
```
```js
// module1.js
define(function (require, exports, module) {
    let count = 0;

    function addCount() {
        count++;
    }

    function getCount() {
        return count;
    }

    module.exports = {addCount, getCount};
})
```
```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        <script src="https://cdn.bootcdn.net/ajax/libs/seajs/3.0.3/sea.js"></script>
        <script>
            // 使用
            seajs.use('./main'); 
        </script>
    </body>
</html>
```


---

### 4. ES6 Module
在`ES6`之前，社区制定了一些模块加载方案，其中最主要的是`CommonJS`和`AMD`。
其中`CommonJS`适用于服务器，`AMD`适用于浏览器。`ES6`的出现，完全可以取代`CommonJS`和`AMD`，成为浏览器和服务器通用的模块化解决方案。  

**ES Module与AMD CommonJS设计思想区别**
- `AMD、CommonJS`都只能在代码运行时，确定依赖，无法做到按需加载（代码运行时加载）；
- `ES Module`设计思想尽量"静态化"，即代码 **编译阶段** 就确定模块输出的东西，以及模块之间的相互依赖关系（编译时加载）。效率要比 `CommonJS` 模块的加载方式高

> 编译时加载（静态加载）：即在代码运行之前的编译阶段就确定其依赖关系和输出。
> 静态加载要比运行时加载时的效率高
```js
// ES6 Module
import {m1, m2, m3} from './module1.js';
```
以上代码的实质是从`module1.js`中加载3个方法，并不是解构赋值，**而是其他方法不会加载**。

注意：`ES6`模块本身不是对象！！！

`ES6 Module`中，单个导出`export xxx`，默认导出`export default xxx`
#### 单个导出/导入
单个导入并不是解构赋值，因为`ES6 Moudle`在实现了按需加载，未导入的功能完全不会加载。
```js
// app.js
export const name = '小红';
export const list = [1, 2, 3];

// --------- 导入 --------------

import {name} from './app'; // '小红'
import * as info from './app'; // {name: '小红', list: [1, 2, 3]}
```
#### 默认导出/导入
```js
// app.js
export default {
    name : '1',
    age: 20
}

// --------- 导入 --------------
import info from './app.js'
```
#### 混合导出/导入
- 该文件内用到混合导入，`import`语句必须先是默认导出，后面再是单个导出，顺序一定要正确否则会出问题。
- `import * from './app.js` 全部导出
```js
// app.js
export const name = '小红';
export const list = [1, 2, 3];

export default {
    job: 'fe',
    age: 25
}

// --------- 导入 --------------
// 全部导出
import * as all from './app.js';
console.log(all); // {default:  {job: 'fe',age: 25}, name: '小红', list: [1, 2, 3]}

// 该文件内用到混合导入，import语句必须先是默认导出，后面再是单个导出，顺序一定要正确否则会出问题。
import info, {name, list} from './02_混合导出.js';
```
#### | export 关键字
需要特别注意的是，`export`命令规定的是对外的接口，**必须与模块内部的变量建立一一对应关系**。
```js
// 报错
export 1;

// 报错
var m = 1;
export m;
```
上面两种写法都会报错，因为没有提供对外的接口。 第一种写法直接输出1，第二种写法通过变量`m`，还是直接输出1。1只是一个值，不是接口。正确的写法是下面这样。
```js
// 写法一
export var m = 1;

// 写法二
var m = 1;
export {m};

// 写法三
var n = 1;
export {n as m};
```
#### | import 关键字
**1. import 会发生变量提升**
以下代码不会报错，因为`import`会发生变量提升。
```js
foo();
import {foo} from './app.js';
```
**2. import 定义的变量是常量，重新赋值会报错**
```js
import info ,{name, list} from './02_混合导出.js';
info = 1;   // 报错Uncaught TypeError: Assignment to constant variable.
```
**3. 导入后重命名**
使用`as`进行重命名
`import {name as newName} from './app.js`  
`import * as all from './app.js`

#### | 导入值是原值的引用
... 待补充

#### | ES Module是静态编译
由于`ES Module`是静态编译，在运行之前就会确定，所以以下写法都会报错:
```js
// 报错
import { 'f' + 'oo' } from 'my_module';

// 报错
let module = 'my_module';
import { foo } from module;

// 报错
if (x === 1) {
import { foo } from 'module1';
} else {
import { foo } from 'module2';
}
```
#### 总结
- `ES6 Module`是静态的，不可以动态加载模块，其对依赖的关系和输出的功能在编译阶段就已经确定
- `Es Module`导出的是值的引用，并且值都是可读的，不能修改。

### 相关文章
- [JavaScript 标准参考教程（alpha）- CommonJS规范](http://javascript.ruanyifeng.com/nodejs/module.html)
- [阮一峰 - require.js的用法](https://www.ruanyifeng.com/blog/2012/11/require_js.html)
- [JavaScript 标准参考教程（alpha）- RequireJS和AMD规范](https://javascript.ruanyifeng.com/tool/requirejs.html#toc3)
- [ECMAScript 6 入门（第三版）- Module ](https://wizardforcel.gitbooks.io/es6-tutorial-3e/content/docs/module.html)
- [ES6模块和CommonJS模块有哪些差异？](https://github.com/YvetteLau/Step-By-Step/issues/43)
