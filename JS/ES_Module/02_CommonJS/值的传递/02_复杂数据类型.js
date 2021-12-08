/**
 * 如果是复杂数据类型，导入时是其原值的浅拷贝
 */

let name = 1;
let list= [];

module.exports = {
    name: name,
    list: list
}


setTimeout(() => {
    list.push(1);
    name++;
},3000)

// ------------- 导入 ----------------

// const {list, name} = require('./值的传递/02_复杂数据类型.js');
// console.log(name, list);      // 1 []
//
// setTimeout(() => {
//     const {name: name1, list: list1} = require('./值的传递/02_复杂数据类型.js');
//     console.log(name1, list1);     // 1 [1]
// }, 4000)
//

