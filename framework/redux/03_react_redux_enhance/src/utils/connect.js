import React, {PureComponent} from 'react';
import store from '../store';

export default function connect({mapStateToProps, mapDispatchToProps}) {
    return function (WrappedComponent) {

        return class extends PureComponent {
            state = {
                reduxStore: mapStateToProps(store.getState())
            };

            componentDidMount() {
                store.subscribe(() => {
                    this.setState({reduxStore: mapStateToProps(store.getState())})
                });
            }

            render() {
                return (
                    <WrappedComponent
                        {...this.props}
                        {...mapStateToProps(store.getState())}
                        {...mapDispatchToProps(store.dispatch)}
                    />
                );
            }
        };
    };
}
