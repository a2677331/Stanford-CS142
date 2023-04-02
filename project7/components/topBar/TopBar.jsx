import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import './TopBar.css';
import axios from "axios";

/**
 * * Jian Zhong
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { version: null };
    this.source = axios.CancelToken.source();
    this.uploadInput = null; // photo upload input
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
      // Use Axios to send request and set the version state variable.
      axios 
        .get(url, { cancelToken: this.source.token })
        .then(response => { // Handle success
          console.log("** Topbar: fetched version number **");
          this.setState({ version: response.data.__v });
        })
        .catch(e => console.log("Error: logout error in posting ", e.message));
    }
  }

  // hanlde axios request cancellation
  componentWillUnmount() {
    this.source.cancel("Request cancelled by user");
  }

  // Handle user log out
  handleLogOut = () => {
    // Use Axios to send POST request to log out user.
    axios
      .post('/admin/logout')
      .then(response => {
        if (response.status === 200) {
          this.props.onLoginUserChange(null);
          console.log("** TopBar: log out OK **");
        }
      })
      .catch(e => console.log("Error: logout error in posting ", e.message));
  };

  // Handle new photo upload
  handlePhotoSubmit = e => {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {
      // create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append("uploadedphoto", this.uploadInput.files[0]);
      // send POST request to server to add uploaded photo
      axios
        .post('photos/new', domForm)
        .then((response) => {
          if (response.status === 200) {
            console.log("** TopBar: photo POST update successfully **");
            this.props.onPhotoUpload(); // notify parent component
          }
        })
        .catch(error => console.log("Error: photo update error ", error));

    }
  };

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="fixed">
        <Toolbar>
          {/* App name and Version */}
          <Typography variant="h5" style={{ flexGrow: 1 }}>
            Fakebook
            {this.props.loginUser && ` ver: ${this.state.version}`}
          </Typography>

          {/* Display greeting to Login User*/}
          <Typography variant="h5" style={{ flexGrow: 1 }}>
            {this.props.loginUser ? 
              `👋 Hi, ${this.props.loginUser.first_name}`
            :
              "😄 Please Login"}
          </Typography>

          {/* Display viewing user's name */}
          {this.props.loginUser && (
            <Typography variant="h5" style={{ flexGrow: 1 }}>
              {this.props.match.path.includes("/photos/") && "Photos of "}
              {this.props.match.path.includes("/users/") && "Info of "}
              {this.props.match.params.userId && `${this.props.userName}`}
            </Typography>
          )}

          {/* Photo upload Button */}
          {this.props.loginUser && (
            <form onSubmit={this.handlePhotoSubmit} style={{ flexGrow: 1 }}>
              <Button component="label" style={{ color: "white" }} >
                <PhotoCamera/>
                <input hidden type="file" accept="image/*" ref={domFileRef => { this.uploadInput = domFileRef; }}/>
              </Button>
              <Button type="submit" variant="contained">Upload</Button>
            </form>
          )}

          {/* Log Out Button */}
          <Button
            onClick={this.handleLogOut}
            variant="contained"
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
