/**
 * 重复导入无效：只要 该文件 加载过一次这个依赖，就会缓存其结果。再次导入不会重新加载依赖，会读取其缓存。
 */

// 01_直接导出.js文件只会加载一次
const module1 = require('./01_直接导出');
const module2 = require('./01_直接导出');


console.log(module1, '---', module2);
