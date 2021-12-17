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
// const module1 = require('./02_单个导出后导出对象');
// console.log(module1);
// {name: '小罗', age: 24}
