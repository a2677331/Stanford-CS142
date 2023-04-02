import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import "./TopBar.css";
import axios from "axios";
import { CloudUpload, ExitToApp, AddAPhotoOutlined, CloseRounded } from "@material-ui/icons";

/**
 * * Jian Zhong
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: null,
      uploadInput: null, // photo upload input
      openSnackbar: false,// control snackbar open or not
    };
  }

  /**
   * Get version number from server, and display it in TopBar
   * Execute after first render is completed.
   */
  componentDidMount() {
    // Only when is not on login page, then use Axios to send request and set the version state variable.
    if (!this.props.location.pathname.includes("/login-register")) {
      // get current URL
      axios
        .get("http://localhost:3000/test/info") // Load version number from server
        .then((response) => {
          // Handle success
          console.log("** Topbar: fetched version number **");
          this.setState({ version: response.data.__v });
        })
        .catch(e => console.log("Error: logout error in posting...", e.message));
    }
  }

  // Handle user log out
  handleLogOut = () => {
    // Use Axios to send POST request to log out user.
    axios
      .post("/admin/logout")
      .then(response => {
        if (response.status === 200) {
          console.log("** TopBar: log out OK **");
          this.props.onLoginUserChange(null);
        }
      })
      .catch(e => console.log("Error: logout error in posting", e.message));
  };

  // Handle new photo upload
  handlePhotoSubmit = (e) => {
    e.preventDefault(); // prevent default behavior
    const imageFile = this.state.uploadInput; // get image file
    this.setState({ uploadInput: null }); // clear upload button

    if (imageFile.size > 0) {
      // check if the file content is already uploaded
      // create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append("uploadedphoto", imageFile);
      // send POST request to server to add uploaded photo
      axios
        .post("photos/new", domForm)
        .then((response) => {
          if (response.status === 200) {
            console.log("** TopBar: photo successfully uploaded **");
            this.props.onPhotoUpload(); // notify parent component
          }
        })
        .catch(err => console.log("Error: photo uploaded error ", err));
    }
  };

  /**
   * Handle image file: read image file and update it to this.state.uploadInput
   */
  handleImageUpload = (e) => {
    e.preventDefault();
    let reader = new FileReader(); // file reader
    let file = e.target.files[0]; // get the image file
    reader.readAsDataURL(file); // start the process of reading the file
    reader.onloadend = () => {
      //  to handle the result of the read operation
      this.setState({ uploadInput: file });
    };
  };

  // close snackbar when clickaway or openSnackbar is false.
  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ openSnackbar: false });
  };

  // show snackbar when logout button is clicked on login page
  handleOnClick = () => { 
    this.setState({ openSnackbar: true });
  };

  // let button click execute two callback functions at a time
  handleButtonClick = () => {
    this.handleLogOut();
    this.handleOnClick();
  };


  render() {
    return (
      <AppBar
        className="cs142-topbar-appBar"
        position="fixed"
        style={{ backgroundColor: "#001e1d" }}
      >
        <Toolbar>
          {/* App name and Version */}
          <Typography variant="h5" style={{ flexGrow: 1 }}>
            Fakebook
            {this.props.loginUser && ` ver: ${this.state.version}`}
          </Typography>

          {/* Display greeting to Login User*/}
          <Typography variant="h5" style={{ flexGrow: 1 }}>
            {this.props.loginUser
              ? `👋 Welcome back, ${this.props.loginUser.first_name}!`
              : "😄 Please Login"}
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
              <Button
                component="label"
                title="Add a pohto"
                style={{ color: "#f9bc60" }}
              >
                <AddAPhotoOutlined fontSize="large" />
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={this.handleImageUpload}
                />
              </Button>
              {/* Show upload button only when image is selected */}
              {this.state.uploadInput && (
                <IconButton type="submit">
                  <CloudUpload style={{ color: "#fec7d7" }} fontSize="large" />
                </IconButton>
              )}
            </form>
          )}

          {/* Log Out Button */}
          <IconButton title="Log out your account" onClick={this.handleButtonClick} variant="contained" >
            <ExitToApp style={{ color: "#e16162" }} fontSize="large" />
          </IconButton>

          {/* to prompt user when already logged out */}
          <Snackbar
            open={this.state.openSnackbar}
            autoHideDuration={5000}
            onClose={this.handleClose}
            message="You are currently logged out."
            action={(
              <IconButton color="secondary" onClick={this.handleClose}>
                <CloseRounded/>
              </IconButton>
            )}
          />

        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
