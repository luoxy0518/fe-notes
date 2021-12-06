/**
 * namespace模式
 *
 * 编码：通过对象，将有关联的方法和变量挂载到对象上
 * 问题：可以通过对象方式直接修改值
 */

var module1 = {
    data: 'module1',
    getData(){
        return this.data;
    }
}

