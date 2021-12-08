/**
 * namespace模式：简单对象封装
 *
 * 作用：减少了全局变量污染，减少了命名冲突
 * 问题：不安全，数据不是私有的，内部属性可以被外部修改
 */

var module1 = {
    data: 'module1',
    getData(){
        return this.data;
    }
}

