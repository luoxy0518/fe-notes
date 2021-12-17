/**
 * 全局function模式
 *
 * 编码：将不同的功能封装为不同的函数
 * 问题：污染全局命名空间，容易造成命名冲突，模板之间看不出依赖关系
 */

var data = 'module1';

function module() {
    console.log(data);
}
