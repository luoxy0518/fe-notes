import React, {PureComponent} from 'react';
import connect from '../utils/connect';
import {desAction} from '../store/actionCreators';
@connect({
    mapStateToProps: (state) => ({
        counter: state.counter
    }),
    mapDispatchToProps: (dispatch) => ({
        desAction: (number) => dispatch(desAction(number))
    })
})
export default class Home extends PureComponent {
    render() {
        return (
            <div>
                <h1>Home</h1>
                <h2>当前计数：{this.props.counter}</h2>
                <button onClick={() => this.props.desAction(1)}>-1</button>
                <button onClick={() => this.props.desAction(5)}>-5</button>
            </div>
        );
    }
}
