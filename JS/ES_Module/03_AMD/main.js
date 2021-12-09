/**
 * 项目的入口js文件
 *
 * 如果是使用requireJs，那么一定是有依赖的
 */

// 入口文件依赖 jquery.js 、module1 、module2
// 当依赖加载完毕后，会执行回调函数
require(['./jquery.min', './module1', './module2'], function ($, m1, m2) {
    ($('#root')[0]).style.background = 'red';
    console.log(m1, '模块1');
    console.log(m2, '模块2');
});


