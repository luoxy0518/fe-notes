import React, {PureComponent} from 'react';
import store from '../store';
import {desAction} from '../store/actionCreators';

class Home extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            counter: store.getState().counter
        }
        this.unSubscribe = store.subscribe(() => {
            this.setState({counter: store.getState().counter})
        });
    }

    desNumber = (num) => {
        store.dispatch(desAction(num));
    }

    componentWillUnmount() {
        this.unSubscribe();
    }

    render() {
        const {counter} = this.state;

        return (
            <div>
                <h1>home</h1>
                <h2>当前计数：{counter}</h2>
                <button onClick={() => this.desNumber(1)}>-1</button>
                <button onClick={() => this.desNumber(5)}>-5</button>
            </div>
        );
    }
}

export default Home;
