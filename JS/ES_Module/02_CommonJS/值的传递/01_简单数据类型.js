/**
 * 导出的是简单数据类型，外部的值不受内部值变化的影响
 */
let name = 1;

setTimeout(() => name++, 3000);
module.exports.name = name;


// ------------- 导入 ----------------

// // 简单数据类型，导出会将其复制一份，两者互不影响
// const {name} = require('./值的传递/01_简单数据类型.js');
// console.log(name);      // 1
//
// // 4000ms后又加载同一模块，因为在此文件中加载过该模块，所以不会重新加载。会从缓存中取值，取的还是第一次加载时的值：1
// setTimeout(() => {
//     const {name: name1} = require('./值的传递/01_简单数据类型.js');
//     console.log(name1);     // 1
// }, 4000)




