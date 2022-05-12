import React, {PureComponent} from 'react';
import store from '../store';
import {addAction} from '../store/actionCreators';

class About extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            counter: store.getState().counter
        };
        store.subscribe(() => {
            this.setState({counter: store.getState().counter});
        });
    }

    addNumber = (num) => {
        store.dispatch(addAction(num));
    };

    componentWillUnmount() {
        // 取消订阅store
        this.unSubscribe();
    }

    render() {
        const {counter} = this.state;

        return (
            <div>
                <h1>About</h1>
                <h2>当前计数：{counter}</h2>
                <button onClick={() => this.addNumber(1)}>+1</button>
                <button onClick={() => this.addNumber(5)}>+5</button>
            </div>
        );
    }
}

export default About;
