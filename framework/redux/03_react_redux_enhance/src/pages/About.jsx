import React, {PureComponent} from 'react';
import connect from '../utils/connect';
import {addAction} from '../store/actionCreators';

class About extends PureComponent {
    render() {
        return (
            <div>
                <h1>About</h1>
                <h2>当前计数：{this.props.counter}</h2>
                <button onClick={() => this.props.addNumber(1)}>+1</button>
                <button onClick={() => this.props.addNumber(5)}>+5</button>
            </div>
        );
    }
}

export default connect({
    mapStateToProps: (state) => ({
        counter: state.counter
    }),
    mapDispatchToProps: (dispatch) => ({
        addNumber: (number) => dispatch(addAction(number))
    })
})(About);
