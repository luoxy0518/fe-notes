# setTimeout vs setInterval vs requestAnimationFrame
# 引言
在日常开发中，我们常常会用到`js`有关定时器的`API`(`setTimeout setInterval`)，我们更多的只会停留在使用层面，很少去仔细思考两者之间的区别、优点、缺点。
不知道你有没有思考过这个问题：明明可以用定时器`API`完成的事情，为啥`HTML5`又提供了`requestAnimationFrame`🤔？

😠作为一个合格的前端工程师，深入理解这三者之间的联系、区别还是非常有必要的。今天本文就带着大家一起深入了解`setTimeout、setInterval、requestAnimationFrame`。

## 动画前置知识
在此简单介绍一下形成动画的原因和基本概念，方便后面阅读理解。
### 1. 计算机屏幕刷新率与浏览器重绘次数
- 屏幕刷新率指`1s`内屏幕刷新的次数。
- 一般的电脑的屏幕刷新率为`1s 60次`(`1000ms / 60 ≈ 16.7ms` | `60FPS`)，也就是每`16.7ms`会刷新一下屏幕。当然此数值受到分辨率、显卡、屏幕尺寸等其他因素的影响。
- 由于一般的电脑的刷新频率是`60FPS`，所以大多数浏览器会限制其重绘次数，一般不会超过计算机的重绘次数，因为即使超过了其频率，用户的体验也不会得到提升。

### 2. 动画是如何形成的？
动画是由于肉眼导致的视觉残留，通过连续播放的静态图像形成的动态幻觉。**当`1s`中连续播放24张图片时(`24FPS`)，即可形成流畅的动画，通常来说计算机的刷新频率是`60FPS`**。

### 3.web实现动画的方式
- `css`：`animation`、`transition`
- `js`: `setTimeout`、`setInteval`
- `html`: `canvas`、`svg`
- `requestAnimationFrame`等...

本文将重点介绍`setTimeout`、`setInterval`、`requestAnimationFrame`这三种`API`。

# 正文
## setInterval
`setInterval`方法按照指定的周期（毫秒）来调用函数或执行一段代码段（`eval`）。
> 敲重点：定时器指定的时间间隔，表示的是何时将回调函数添加到消息队列，而不是何时执行回调函数。
> 真正何时执行幻术的时间是不能确定的，取决于该回调函数何时被主线程的事件循环取到，并执行。
### 参数
- `function/code`
    - 【必需】要重复调用的函数/字符串。当为字符串时，会被编译为`js`代码执行。
- `delay`
    - 【必需】周期性调用`function/code`的时间间隔，以毫秒计数。
    - 注：`HTML5`规定，执行时间间隔最小为`10ms`当小于`10ms`时，默认为`10ms`。
- `args1... argsN`
    - 【非必需】传递给执行函数的参数
```js
// 每1000ms，控制台打印1
setInterval(function(){
    console.log(1);
}, 1000);
```    
### 缺点
#### 1.存在无用调用，浪费性能
会一直不停的执行函数，**即使将浏览器最小化，或者切换到另一个`tab`，定时器还依旧会继续在后台执行**。除非关闭网页才会停止调用。
#### 2.忽略错误代码，即使出错还会调用
`setInterval`中执行的代码如果出错，不会停止运行，而是继续调用。
#### 3.无法保证调用的时间间隔相同；某次回调可能会被跳过
> 敲重点：`setInterval`每次将回调函数推入异步队列前，会检查异步队列中是否有**该定时器的代码实例**，如果存在，则不会添加本次回调函数。

如果回调函数的执行需要花费很大时间执行，某些处于中间的调用会被忽略。

例：分析如下代码执行步骤
```text
...some event...
setInterval(T, 100);
// 代表每100ms将T函数推入异步队列中
```
![img.png](./img/img.png)
1. 代码开始执行，先执行`some event`同步代码，`100ms`后将`T1`添加到异步队列的尾部；
2. 此时主线程依旧有`event`任务在执行，所以无法立即执行`T1`。只能待主线程任务结束后，执行`T1`；
3. 又过了`100ms`，`T1`在主线程执行，此时将`T2`添加到异步队列尾部，由于`T1`还在执行，所以`T2`只能等待执行；
4. **又过了`100ms`，此时本应该将`T3`添加到异步队列尾部，但是由于异步队列中存在`T2`,所以`T3`不会被添加到队列中（被跳过）。**
5. `T1`执行完毕后，立即从异步队列中取出`T2`执行（并没有达到定时器的效果）

由以上的例子我们可以看出`setInterval`的两个缺点：
1. 某些极端情况下，无法保证按照时间间隔运行回调函数；
2. 当回调函数执行时间过长时，某次的回调可能被直接忽略。
### 使用setTimeout替代setInterval
```js
/**
 * 使用setTimeout模拟setInterval计时器
 * @param fn
 * @param delay
 * @param args
 * @returns {{clear: (function(): void)}}
 * @private
 */
function _interval(fn, delay, ...args){
    let timerId;

    function callback(){
        fn(...args);
        timerId = setTimeout(callback, delay)
    }

    timerId = setTimeout(callback, delay);
    // 清除计时器方法
    return {
        clear:() => clearTimeout(timerId)
    };
}

// 开始计时器
const timer  = _interval(function(){
    console.log(1);
}, 1000);

// 清除该计时器
setTimeout(timer.clear, 5 * 1000);
```

## setTimeout
`setTimeout`设置一个定时器，该定时器在指定时间到期**后**执行一个函数或者一段代码。
> 敲重点：定时器指在延迟时间后会将回调函数添加到异步队列中，真正的执行时机需要等到主线程为空后取出再执行。
> 所以 真正的执行的时间 >= 延迟时间
### 参数
- `function/code`
    - 【必需】要重复调用的函数/字符串。当为字符串时，会被编译为`js`代码执行。
- `delay`
    - 【必需】周期性调用`function/code`的时间间隔，以毫秒计数。
    - 注：`HTML5`规定，执行时间间隔最小为`4ms`当小于`4ms`时，默认为`4ms`。
- `args1... argsN`
    - 【非必需】传递给执行函数的参数

```js
// 1000ms后将函数添加到异步队列中，打印1
setTimeout(function(){
    console.log(1);
}, 1000);
``` 
### 缺点
#### 1.执行时间不能确定
#### 2.动画在某些机型上可能存在卡顿、丢帧、抖动的现象。
如开篇所述，动画的本质是：肉眼导致的视觉残留，通过连续播放的静态图像形成的动态幻觉。我们有时会感到卡顿是因为帧率不够。

虽然可以通过设定固定间隔`setTimeout(fn, 16.7)`的方式，设置时间间隔与大部分计算机刷新频率同步。但是依旧会受到以下因素的影响：
- 由于`JS引擎`线程是异步的，`setTimeout`本身是异步任务，需要等待主线程的任务执行完毕后才可以执行。所以其真实的`执行时间 >= 16.7ms`
- 不同的机器，其刷新频率是不同的，`setTimeout`只能写死一个时间，不够准确

以上的情况都会使`setTimeout`执行的时间间隔和浏览器刷新频率不同步，导致动画卡顿、丢帧、抖动的现象。


那么有没有动画的终极神器呢？下面来介绍`requestAnimationFrame`API。
## requestAnimationFrame(rFA)
> 虽然我们可以使用`CSS3`的`animation、transition`属性来实现动画，但是如果遇到"请将滚动条**匀速**的返回到顶部"的需求，`CSS3`就鞭长莫及了。因为`CSS3`无法控制`scrollTop`属性。这时就要用到`requestAnimationFrame`这个神器了。

`window.requestAnimationFrame() `告诉浏览器:你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。
### 参数
- `callback`
    - 【必需】下一次重绘之前要执行的函数，该函数默认被传入一个`performance`参数，用来测试网页性能。
### 使用示例
> 如果想形成连续的动画，需要在`rAF`中回调函数中，再次调用自己

如下代码只会再浏览器第一次刷新时调用，只会执行一次：
```js
window.requestAnimationFrame(function () {
    console.log(this);  // 只执行一次 打印window
})
```
如果想与浏览器刷新频率同步调用，需这样写：
```js
// 不断打印出 window
function animateFn (){
    console.log(this);
    window.requestAnimationFrame(animateFn);
}
window.requestAnimationFrame(animateFn);
```
### 优点
#### 1.执行时机由浏览器决定，与浏览器刷新频率保持同步，不会有丢帧、卡顿的情况
与`setTImeout、setInterval`不同，`requestAnimationFrame`回调函数的调用时机不是由开发者定义，是由浏览器决定的。

- 如果该机器的刷新的频率为`60FPS`，`requestAnimationFrame`的回调函数就会`1 / 60  ≈ 16.7ms`左右执行一次；
- 如果机器的刷新频率为`80FPS`，`requestAnimationFrame`的回调函数就会`1 / 80  ≈ 12.5ms`左右执行一次；

这样的机制，可以与浏览器刷新频率同步，不会导致丢帧、卡顿的情况。

#### 2.节省CPU资源
与`setTimeout、setInterval`不同，当网页被最小化，或是当前`tab`处于"未激活"的状态时，该页面的刷新任务会被系统暂停，`requestAnimationFrame`也会停止渲染，节省`CPU`资源。
当`tab`重新被"激活"后，`requestAnimationFrame`会继续渲染。

#### 3.高频函数节流
对于`resize、scroll`高频触发事件来说，使用`requestAnimationFrame`可以保证在每个绘制区间内，函数只被执行一次，节省函数执行的开销。
如果使用`setTimeout、setInterval`可能会在浏览器刷新间隔中有无用的回调函数调用，浪费资源。

### cancelAnimation(id) 取消rFA
与`setTimeout、setInterval`相同，`requestAnimationFrame`执行完后会返回一个代表此次执行的唯一`id`，可以用此`id`取消`rFA`。
```js
const id = requestAnimationFrame(function(){});
cancelAnimationFrame(id);
```

### 写个🌰
使用`rFA`，实现点击`div`开始向右运动，点击停止，再次点击继续运动：
```html
<!doctype html>
<html lang="en">
<head>
    <title>Document</title>
    <style>
        .box{
            width: 100px;
            height: 100px;
            background: paleturquoise;
            position: absolute;
            left: 0;
        }
    </style>
</head>
<body>
    <div class="box"/>
    <script src="./index.js"></script>
</body>
</html>
```
```js
(function (window, document) {
    const oBox = document.getElementsByClassName('box')[0];
    let animationId;

    oBox.addEventListener('click', function () {
        animationId ? cancelAnimation() : startAnimation(oBox);
    });

    /**
     * 开始运动
     * @param element dom元素
     */
    function startAnimation(element) {
        element.style.left = parseInt(window.getComputedStyle(element).getPropertyValue("left")) + 1 + 'px';
        animationId = requestAnimationFrame(() => startAnimation(element))
    }

    /**
     * 取消运动
     */
    function cancelAnimation() {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
})(window, document);
```

# 写在最后
看到这里，希望本文对你有一些帮助😁。如果文章中有错误，麻烦评论指出，一起进步~~~~。

我是抹茶，不断学习的一名`coder`✌🏻。
