import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
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
   * Get version number from server, and display it in TopBar
   * Execute after first render is completed.
   */
  componentDidMount() {
    const url = "http://localhost:3000/test/info"; // Load version number from server

    axios // Use Axios to send request and set the version state variable.
      .get(url)
      .then(response => { // Handle success
      console.log("** Succes from Topbar: fetched data from " + url +" **");
      this.setState({ version: response.data.__v });
      /**
       * ! why here will have bugs when refeashing the page under user detail view???
       * ! ?????????????????
       */
      })
      .catch(error => {   // Handle error
        console.log("** Error from Topbar: Axios fetching **\n", error.message);
      });
  }

  render() {

    // console.log("Printing loginUser name: ", this.props.loginUserName);

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>

          {/* App name and version */}
          <Typography variant="h5" style={{flexGrow: 1}}>
            Fakebook Ver: {this.state.version}
          </Typography>

          {/* Display greeting if user is logged in */}
          <Typography variant="h5" style={{flexGrow: 1}}>
            {
              this.props.isLoggedIn ? 
                `👋 Hi, ${this.props.loginUser.first_name}`
                :
                "😄 Please Login"
            }
          </Typography>

          {/* Display user's name for under user photo and user detail page */}
          <Typography variant="h5" style={{flexGrow: 1 }}>
            { this.props.match.path.includes("/photos/") && "Photos of " }
            { this.props.match.path.includes("/users/") && "Info of " }
            { this.props.match.params.userId && `${this.props.userName}` }
          </Typography>

          {/* Log Out Button */}
          <Button style={{flexGrow: 0, color: "white"}}>
            Log Out
          </Button>          

        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
