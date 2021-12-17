// module2.js 依赖 module1.js
define(function (require, exports, module) {
    const {addCount, getCount} = require('./module1');
    addCount();
    addCount();
    addCount();

    const count = getCount();
    console.log(count);
})
