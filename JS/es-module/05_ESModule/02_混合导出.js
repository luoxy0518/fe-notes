export const name = '小红';
export const list = [1, 2, 3];

export default {
    job: 'fe',
    age: 25
}


// --------- 导入 --------------
// import * as all from './02_混合导出.js';
// console.log(all); // {default:  {job: 'fe',age: 25}, name: '小红', list: [1, 2, 3]}

// 该文件内用到混合导入，import语句必须先是默认导出，后面再是单个导出，顺序一定要正确否则会出问题。
// import info, {name, list} from './02_混合导出.js';
