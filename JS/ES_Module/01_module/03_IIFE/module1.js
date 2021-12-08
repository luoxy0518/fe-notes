/**
 * IIFE：匿名函数立即执行，利用函数作用域，形成闭包
 *      immediately-invoked function expression(立即调用函数表达式)
 *
 * 作用：数据是私有的。将数据和行为封装到函数内部，通过给window添加属性，向外暴露接口。
 * 问题：如何实现模块依赖？
 */

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
