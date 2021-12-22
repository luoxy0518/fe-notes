// (function (window, document) {
//     const oBox = document.getElementsByClassName('box')[0];
//     let animationId;
//
//     oBox.addEventListener('click', function () {
//         animationId ? cancelAnimation() : startAnimation(oBox);
//     });
//
//     /**
//      * 开始运动
//      * @param element dom元素
//      */
//     function startAnimation(element) {
//         element.style.left = parseInt(window.getComputedStyle(element).getPropertyValue("left")) + 1 + 'px';
//         animationId = requestAnimationFrame(() => startAnimation(element))
//     }
//
//     /**
//      * 取消运动
//      */
//     function cancelAnimation() {
//         cancelAnimationFrame(animationId);
//         animationId = null;
//     }
// })(window, document);


// 用setTimeout 模拟setInterval
(function(){
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

    window._interval = _interval;
})();

// 定义计时器
const timer  = _interval(function(){
    console.log(1);
}, 1000);

// 清除该计时器
setTimeout(timer.clear, 5 * 1000);

