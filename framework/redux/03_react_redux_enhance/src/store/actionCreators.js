import {ADD, DES} from './constants.js';

export const addAction = (num) => ({type: ADD, num});
export const desAction = (num) => ({type: DES, num});

