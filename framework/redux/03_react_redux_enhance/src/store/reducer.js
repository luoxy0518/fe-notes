import {ADD, DES} from './constants.js';

const initialState = {
    counter: 0,
};
function reducer(state = initialState, action){
    switch (action.type){
        case ADD:
            return {...state, counter: state.counter + action.num};
        case DES:
            return {...state, counter: state.counter - action.num};
        default:
            return state;
    }
}
export default reducer;
