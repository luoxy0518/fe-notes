// // function sum(a, b) {
// //     this.a = a;
// //     this.b = b;
// //     this.sum = a + b;
// // }
// //
// //
// // const p1 = new Proxy(sum, {
// //     // 监听函数调用时触发
// //     apply(target, thisArg, arguments) {
// //         return target(arguments[0], arguments[1] * 100)
// //     },
// //     construct(target, argArray) {
// //         console.log(argArray);
// //         return new target(argArray[0], argArray[1] * 10)
// //     }
// // });
// //
// // // 1. 监听函数调用
// // p1(1, 2);   // output: 201
// // // 2. 监听new操作
// // new p1(10, 20);     //  output: sum { a: 10, b: 200, sum: 210 }
// //
//
// /**
//  * 监听对象
//  */
// const obj = {id: 2};
// const p2 = new Proxy(obj, {
//     // 拦截获取值操作
//     get(target, key, receiver) {
//         console.log('代理对象的属性');
//         return target[key];
//     },
//     // 拦截赋值操作
//     set(target, key, value, receive) {
//         console.log(`将属性${key}赋值为: ${value}`);
//         target[key] = value;
//     },
//     // 拦截in操作
//     has(target, key){
//         if(key[0] === '_') return false;
//
//         return key in target;
//     },
//     // 拦截 删除操作,此方法必须返回Boolean值
//     deleteProperty(target, key) {
//         // 如果删除的key 为 id, 阻止删除操作
//         if(key === 'id') return false;
//         delete target[key];
//         return true;
//     }
// });
//
// p2.a = 1;
// console.log(p2.a);
// delete p2.id;
// delete p2.a;
//
// console.log(p2);
//
// // 死循环
// // const obj2 = {};
// // Object.defineProperty(obj2, 'a', {
// //     get(key) {
// //         return this[key];
// //     },
// //     set(newVal) {
// //         console.log('设置值');
// //         this.a = newVal;
// //     }
// // });
// //
// // obj2.a = 12;
// // console.log(obj2);
//
// // 发布订阅模式
// class EventEmitter {
//     constructor() {
//         // 事件对象，存放订阅的名字和事件
//         this.events = {};
//     }
//     // 订阅事件的方法
//     on(eventName,callback) {
//         if (!this.events[eventName]) {
//             // 注意时数据，一个名字可以订阅多个事件函数
//             this.events[eventName] = [callback]
//         } else  {
//             // 存在则push到指定数组的尾部保存
//             this.events[eventName].push(callback)
//         }
//     }
//     // 触发事件的方法
//     emit(eventName) {
//         // 遍历执行所有订阅的事件
//         this.events[eventName] && this.events[eventName].forEach(cb => cb());
//     }
//     // 移除订阅事件
//     removeListener(eventName, callback) {
//         if (this.events[eventName]) {
//             this.events[eventName] = this.events[eventName].filter(cb => cb !== callback)
//         }
//     }
//     // 只执行一次订阅的事件，然后移除
//     once(eventName,callback) {
//         // 绑定的时fn, 执行的时候会触发fn函数
//         let fn = () => {
//             callback(); // fn函数中调用原有的callback
//             this.removeListener(eventName, fn); // 删除fn, 再次执行的时候之后执行一次
//         }
//         this.on(eventName,fn)
//     }
// }
//
// let em = new EventEmitter();
// let workday = 0;
// em.on("work", function() {
//     workday++;
//     console.log("work everyday");
// });
//
// em.once("love", function() {
//     console.log("just love you");
// });
//
// function makeMoney() {
//     console.log("make one million money");
// }
// em.on("money",makeMoney);
//
// let time = setInterval(() => {
//     em.emit("work");
//     em.removeListener("money",makeMoney);
//     em.emit("money");
//     em.emit("love");
//     if (workday === 5) {
//         console.log("have a rest")
//         clearInterval(time);
//     }
// }, 1);

// function foo(a, b){
//     this.a = a;
//     this.b = b;
//     console.log('我执行了')
// }
//
// const fooProxy = new Proxy(foo, {
//     apply(target, thisArg, argumentsList){
//         console.log('函数被调用');
//         return foo();
//     },
//     construct(target, argumentslist, newTarget){
//         console.log('函数被实例化');
//         return new foo(...argumentslist);
//     }
// });
//
// fooProxy(1,2);
// // 函数被调用
// // 我执行了
// new fooProxy(1,2);
// // 函数被实例化
// // 我执行了


function reactive(target, prop) {
    Object.defineProperty(target, prop, {
        get() {
            return target[prop];
        },
        set(newVal) {
            target[prop] = newVal;
        }
    })
}

function observe(data) {
    for (let key in data) {
        if (data.hasOwnProperty(key)) reactive(data, key);

    }
}


const obj = {
    name: 'lily',
    age: 18
}
