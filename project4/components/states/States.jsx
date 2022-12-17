import React from "react";
import "./States.css";

import Header from "../header/header.jsx";

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedState: "" }; // selected state name input
    this.handleStatesChange = this.handleStatesChange.bind(this);
    this.states = window.cs142models.statesModel(); // get all states as a list
  }

  // Method called when the input box is typed into.
  handleStatesChange(event) {
    this.setState({ selectedState: event.target.value });
  }

  // Construct list of states JSX
  outputStates() {
    const userInput = this.state.selectedState;
    const title = `Filter the states by "${userInput}"`;
    let filteredStates = this.states.filter((state) =>
      state.toLowerCase().includes(userInput.toLowerCase())
    ); // filter out state that contains substring of user input
    const listItems = [];

    // construct states as <li> items in HTML
    for (let i = 0; i < filteredStates.length; i++) {
      listItems[i] = <li key={i}> {filteredStates[i]} </li>;
    }

    return (
      <React.Fragment>
        <Header></Header>
          <div className="cs142-states-styles">
            <h1>States: </h1>
            <label htmlFor="stateBox">Enter State Name:</label>
            <input
              id="stateBox"
              type="text"
              value={this.state.selectedState}
              onChange={this.handleStatesChange}
            />
            <h2>{title}</h2>
            {listItems.length === 0 ? (
              <h2>No Results</h2>
            ) : (
              <ul>{listItems}</ul>
            )}
          </div>
      </React.Fragment>
    );
  }

  render() {
    return this.outputStates();
  }
}

export default States;
