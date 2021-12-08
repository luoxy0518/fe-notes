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
##### 全局function模式
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
##### namespace模式：简单对象封装
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
##### IIFE（immediately-invoked function expression）：利用匿名函数自执行形成闭包，封闭作用域
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

#### IIFE增强（现代模块化实现的基石）：通过传递参数实现模块之间的依赖，
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
页面中`script`过多，需要发送多个请求，必定会消耗多个资源。（请求资源时间 5 * 20Kb > 1 * 100kb）
- `js`必须以一定顺序引入，当模块中的依赖过多时，可能会由于文件引入顺序问题而出错。
- 由于以上两种原因，导致后期难以维护

### 二、模块化规范
