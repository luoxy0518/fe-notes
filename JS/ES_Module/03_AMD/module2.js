// module2.js

// 此模块依赖m2
define(['./module1'], function(m3){
    return m3.count;
})
