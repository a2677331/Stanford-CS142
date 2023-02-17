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
    this.source = axios.CancelToken.source();
  }

  /**
   * Get version number from server, and display it in TopBar
   * Execute after first render is completed.
   */
  componentDidMount() {
    const url = "http://localhost:3000/test/info"; // Load version number from server

    /**
     * * Only show version number when login
     */
    if (this.props.loginUser) {  
      axios // Use Axios to send request and set the version state variable.
        .get(url, { cancelToken: this.source.token })
        .then(response => { // Handle success
          console.log("** Topbar: fetched version number **");
          this.setState({ version: response.data.__v });
        })
        .catch(error => {   // Handle error
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
  }

  componentWillUnmount() {
    this.source.cancel("Request cancelled by user");
  }

  handleLogOut = () => {
    axios
      .post('/admin/logout')
      .then(response => {
        if (response.status === 200) {
          this.props.handler(null);
          console.log("** Log Out succeed: ", response.data);
        }
      })
      .catch(error => {
        console.log(error.message);
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
  };

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          {/* App name */}
          <Typography variant="h5" style={{ flexGrow: 1}}>
            Fakebook
          </Typography>

          {/* Version */}
          {
            this.props.loginUser && (
              <Typography variant="h5" style={{ flexGrow: 1}}>
                { this.props.loginUser && `Ver: ${this.state.version}` }
              </Typography>
            )
          }

          {/* Display greeting to Login User*/}
          <Typography variant="h5" style={{ flexGrow: 1}}>
            {
              this.props.loginUser ? 
                `👋 Hi, ${this.props.loginUser.first_name}`
              :
                "😄 Please Login"
            }
          </Typography>

          {/* Display viewing user's name */}
          {
            this.props.loginUser && (
              <Typography variant="h5" style={{ flexGrow: 1 }}>
                { this.props.match.path.includes("/photos/") && "Photos of " }
                { this.props.match.path.includes("/users/") && "Info of " }
                { this.props.match.params.userId && `${this.props.userName}` }
              </Typography>
            )
          }
          
          {/* Log Out Button */}
          <Button onClick={this.handleLogOut} style={{ flexGrow: 0, color: "white"}}>Logout</Button>
          {/* <Alert onClose={() => {}}>User is currently logged out.</Alert> */}
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
