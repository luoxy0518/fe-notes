/**
 * CommonJS 在其运行时执行，并非编译时执行，支持动态导入
 */

const arr = ['./01_直接导出.js','./02_单个导出后导出对象.js'];
const result = [];

arr.forEach(url => {
    result.push(require(url))
});

console.log(result); // [ { name: '小李', age: 17 }, { name: '小罗', age: 24 } ]

