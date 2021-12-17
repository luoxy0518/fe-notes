// module1.js
// 此模块没有依赖

define(function () {
    let count = 0;

    function add() {
        count++;
    }

    // 模块导出，可以是任何类型
    return {add, count}
})
