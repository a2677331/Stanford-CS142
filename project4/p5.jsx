import React from "react";
import ReactDOM from "react-dom";

import { HashRouter, Route, Link } from "react-router-dom";

import States from "./components/states/States";
import Example from "./components/example/Example";

/**
 * Dynamic switching of the views betwen State and Example pages.
 */
class View extends React.Component {
  render() {

    return (
      <HashRouter>
        <Link to="/states"><button>Switch to States</button></Link>
        <Link to="/example"><button>Switch to Example</button></Link>

        <Route path="/states" component={States} />
        <Route path="/example" component={Example} />
        <Route path="/" render={() => <h1>Welcome!</h1>} />
      </HashRouter>
    );

  }
}

ReactDOM.render(<View />, document.getElementById("reactapp"));
