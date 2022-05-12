/**
 * 最简单的redux示例
 * @type
 */
const redux = require('redux');

// 1.store
// 通过纯函数reducer将redux联系到一起
const initialState = {
    counter: 0
}

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'increment':
            return {...state, counter: state.counter + 1};
        case 'decrement':
            return {...state, counter: state.counter - 1};
        case 'add':
            return {...state, counter: state.counter + 5};
    }
}
const store = redux.createStore(reducer);

// 2.actions
const action1 = {type: 'increment'};
const action2 = {type: 'decrement'};

const action3 = {type: 'add', count: 5};

// 订阅store的修改，只要派发了action都会触发store的改变
store.subscribe(() => {
    console.log('counter', store.getState().counter);
})


// 3.dispatch
store.dispatch(action1);
store.dispatch(action2);
store.dispatch(action3);


