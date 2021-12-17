/**
 * IIFE增强(依赖模块)：现代模块化实现的基石
 *
 * 作用：通过传参的方式，实现模块的依赖。这样做除了保证模块的独立性，还使得模块之间的依赖关系变得明显。
 */
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
