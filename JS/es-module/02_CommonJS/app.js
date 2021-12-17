const {list, name} = require('./值的传递/02_复杂数据类型.js');
console.log(name, list);      // 1 []

setTimeout(() => {
    const {name: name1, list: list1} = require('./值的传递/02_复杂数据类型.js');
    console.log(name1, list1);     // 1 [1]
}, 4000)

