import React, { useState, useEffect }  from "react";
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
 *  Defining a TopBar, a React componment of CS142 project #5
 */
function TopBar(props) {
  const [version, setVersion] = useState(null);             // the app version
  const [uploadInput, setUploadInput] = useState(null);     // photo upload input
  const [openSnackBar, setOpenSnackBar] = useState(null);   // control snackbar open or not

  // use Axios to send GET request to server to load the version variable.
  const axios_fetchVersion = () => {
    axios
      .get("http://localhost:3000/test/info") // Load version number from server
      .then(response => {
      // Handle success
      setVersion(response.data.__v);
      console.log("** Topbar: fetched version number **");
      })
      .catch(err => console.log("Error: logout error in posting...", err.message));
  };

  // Use Axios to send POST request to log out user.
  const axios_logoutUser = () => {
    axios
      .post("/admin/logout")
      .then(response => {
        if (response.status === 200) {
          console.log("** TopBar: log out OK **");
          props.onLoginUserChange(null);
        }
      })
      .catch(err => console.log("Error: logout error in posting", err.message));
  };

  // Use Axios to send POST request to server to add uploaded photo.
  const axios_sendPhoto = domForm => {
    axios
    .post("photos/new", domForm)
    .then(response => {
      if (response.status === 200) {
        props.onPhotoUpload(); // notify parent component
        console.log("** TopBar: photo successfully uploaded **");
      }
    })
    .catch(err => console.log("Error: photo uploaded error ", err));
  };

   /**
   * Get version number from server, and display it in TopBar
   * Execute after first render is completed.
   */
  useEffect(() => {
    // Only when is not on login page, then use Axios to send request and set the version state variable.
    if (!props.location.pathname.includes("/login-register")) {
      axios_fetchVersion();
    }
  });

  // Handle user log out
  const handleLogOut = () => {
    // Use Axios to send POST request to log out user.
    axios_logoutUser();
  };

  /**
   * Handle image file: read the uploaded photo file and set it to "uploadInput" state variable
   */
  const handleImageUpload = event => {
      event.preventDefault();
      let reader = new FileReader(); // file reader
      let file = event.target.files[0];  // get the image file
      reader.readAsDataURL(file);    // start the process of reading the file
      reader.onloadend = () => {     //  to handle the result of the read operation
        setUploadInput(file);
      };
    };
    

  // Handle new photo upload
  const handlePhotoSubmit = event => {
    event.preventDefault(); // prevent default behavior
    const imageToSend = uploadInput; // get image file
    setUploadInput(null); // clear upload button

    if (imageToSend.size > 0) {
      // check if the file content is already uploaded
      // create a DOM form and add the file to it under the name "uploadedphoto"
      const domForm = new FormData();
      domForm.append("uploadedphoto", imageToSend);
      axios_sendPhoto(domForm);
    }
  };


  // close snackbar when clickaway or openSnackbar is false.
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  // show snackbar when logout button is clicked on login page
  const handleOnClick = () => { 
    setOpenSnackBar(true);
  };

  // Actions for logout account button: will log out user and display prompt for user to log in
  const handleButtonClick = () => {
    handleLogOut();
    handleOnClick();
  };

  // Rendering Components:
  return (
    <AppBar
      className="cs142-topbar-appBar"
      position="fixed"
      style={{ backgroundColor: "#001e1d" }}
    >
      <Toolbar>
        {/* App name and Version */}
        <Typography variant="h5" style={{ flexGrow: 1 }}>
          FakeBook
          {props.loginUser && ` ver: ${version}`}
        </Typography>

        {/* Display greeting to Login User*/}
        <Typography variant="h5" style={{ flexGrow: 1 }}>
          {props.loginUser
            ? `👋 Welcome back, ${props.loginUser.first_name}!`
            : "😄 Please Login"}
        </Typography>

        {/* Display viewing user's name */}
        {props.loginUser && (
          <Typography variant="h5" style={{ flexGrow: 1 }}>
            {props.match.path.includes("/photos/") && "Photos of "}
            {props.match.path.includes("/users/") && "Info of "}
            {props.match.params.userId && `${props.userName}`}
          </Typography>
        )}

        {/* Photo upload Button */}
        {props.loginUser && (
          <form onSubmit={handlePhotoSubmit} style={{ flexGrow: 1 }}>
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
                onChange={handleImageUpload}
              />
            </Button>
            {/* Show upload button only when image is selected */}
            {uploadInput && (
              <IconButton type="submit">
                <CloudUpload style={{ color: "#fec7d7" }} fontSize="large" />
              </IconButton>
            )}
          </form>
        )}

        {/* Log Out Button */}
        <IconButton title="Log out your account" onClick={handleButtonClick} variant="contained" >
          <ExitToApp style={{ color: "#e16162" }} fontSize="large" />
        </IconButton>

        {/* to prompt user when already logged out */}
        <Snackbar
          open={openSnackBar}
          autoHideDuration={5000}
          onClose={handleClose}
          message="You are currently logged out."
          action={(
            <IconButton color="secondary" onClick={handleClose}>
              <CloseRounded/>
            </IconButton>
          )}
        />

      </Toolbar>
    </AppBar>
  );
}

export default TopBar;