import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import './TopBar.css';
import axios from "axios";

/**
 * * Jian Zhong
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: null,
    };
  }

  /**
   * Show version number in TopBar, execute once first render is completed.
   */
  componentDidMount() {

    // Load version number from server
    const url = "http://localhost:3000/test/info";

    // Use Axios to send request and set the version state variable.
    axios.get(url)
      .then(response => {
      // Handle success
      console.log("** Succes: fetched data from " + url +" **");
      this.setState({ version: response.data.__v });

    }).catch(error => {
      // Handle error
      if (error.response) {
        // if status code from server is out of the range of 2xx.
        console.log("** Error: status code from server is out of the range of 2xx. **\n", error.response.status);
      } else if (error.request) {
        // if request was made and no response was received.
        console.log("** Error: request was made and no response was received. **\n", error.request);
      } else {
        // something happened in the setting up the request
        console.log("** Error: something happened in the setting up the request. **\n", error.message);
      }
    });

  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" style={{flexGrow: 1}}>
            Fakebook
          </Typography>
          <Typography variant="h5" style={{flexGrow: 1}}>
            Ver: {this.state.version}
          </Typography>
          <Typography variant="h5">
            { this.props.match.path.includes("/photos/") && "Photos of " }
            { this.props.match.path.includes("/users/") && "Info of " }
            { this.props.match.params.userId && `${this.props.userName}` }
            {/* If "this.props.match.params.userId" is null then is in homepage, don't show user name */}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
