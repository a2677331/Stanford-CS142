import React from 'react';
import ReactDOM from 'react-dom';

import States from './components/states/States';
import Example from './components/example/Example';


/**
 * Dynamic switching of the views betwen State and Example pages.
 */
class View extends React.Component {

    constructor(props) {
        super(props);
        this.state = { showExampleView: true }; // display example view by default
    }

    // To toggle page view state if button pressed
    togglePageView = () => this.setState({ showExampleView: !this.state.showExampleView }); 

    render() { 
        return (
            <React.Fragment>
                <button type="button" onClick={this.togglePageView}>
                    {this.state.showExampleView ? "Swtich to States" : "Swtich to Example"}
                </button>
                {this.state.showExampleView ? <Example/> : <States/>}
            </React.Fragment>
        );
    }
}
 

ReactDOM.render(<View />, document.getElementById('reactapp'), );
