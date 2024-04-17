import React, { useState, useEffect }  from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import "./TopBar.css";
import axios from "axios";
import { CloudUpload, ExitToApp, AddAPhotoOutlined, CloseRounded } from "@material-ui/icons";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';


/**
 * * Jian Zhong
 *  Defining a TopBar, a React componment of CS142 project #5
 */
function TopBar(props) {
  const [version, setVersion] = useState(null);             // the app version
  const [uploadInput, setUploadInput] = useState(null);     // photo upload input
  const [logoutPrompt, setlogoutPrompt] = useState(null);   // control snackbar open or not
  
  const [alertPromptOpen, setAlertPromptOpen] = useState(false); // alert prompt
  const handleAlertOpen = () => setAlertPromptOpen(true);
  const handleAlertClose = () => setAlertPromptOpen(false);

  // use Axios to send GET request to server to load the version variable.
  const axios_fetchVersion = () => {
    axios
      .get("http://localhost:3000/test/info") // Load version number from server
      .then(response => {
        // Handle success
        setVersion(response.data.version);
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
    axios_fetchVersion();
  }, [props.loginUser]); // []: only want to fetch version once, not every render

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
  const handleLogoutPromptClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setlogoutPrompt(false);
  };
  

  // Actions for logout account button: will log out user and display prompt for user to log in
  const handleLogoutPromptClick = () => {
    axios_logoutUser();    // Use Axios to send POST request to log out user.
    setlogoutPrompt(true); // show snackbar when logout button is clicked on login page
  };

  const handleDeleteClick = () => {
    setAlertPromptOpen(false);      // close the alert prompt
    axios
      .post(`/deleteUser/${props.loginUser.id}`)
      .then(response => {
        if (response.status === 200) {
          console.log("** TopBar: Delete Account OK **");
          handleLogoutPromptClick(); // after deleting user account, need to log out the user.
        }
      })
      .catch(err => console.log("Delete account error: ", err.message));
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
          {props.loginUser && ` v${version}`}
        </Typography>

        {/* Display greeting to Login User*/}
        <Typography variant="h5" style={{ flexGrow: 1 }}>
          {console.log("Login user in TopBar: ", props)}
          {props.loginUser
            ? `👋 Welcome back, ${props.loginUser.first_name}!`
            : "😄 Please Login"}
        </Typography>

        {/* Display 'photos of' or 'Info of' of the viewing user's name */}
        {props.loginUser && (
          <Typography variant="h5">
            {window.location.href.includes("/photos/") && "Photos of "}
            {window.location.href.includes("/users/") && "Info of "}
            {props.userName}
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
        <React.Fragment>
          {/* Logout button and styles */}
          <IconButton title="Log out your account" onClick={handleLogoutPromptClick} variant="contained" >
            <ExitToApp style={{ color: "#e16162" }} fontSize="large" />
          </IconButton>
          {/* to prompt user when already logged out */}
          <Snackbar
            open={logoutPrompt}
            onClose={handleLogoutPromptClose}
            autoHideDuration={5000}
            message="You are currently logged out."
            action={(
              <IconButton color="secondary" onClick={handleLogoutPromptClose}>
                <CloseRounded />
              </IconButton>
            )}
          />
        </React.Fragment>


        {/* Account Delete Button */}
        {props.loginUser && (
          <React.Fragment> 
            {/* button for deleting the user account */}
            <IconButton title="Delete your account forever" onClick={handleAlertOpen} variant="contained" >
              <DeleteForeverIcon style={{ color: "red" }} fontSize="large" />
            </IconButton>
            {/* alert prompt */}
            <Dialog
              open={alertPromptOpen}
              onClose={handleAlertClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Deleting an Account"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {`Delete ${props.loginUser.first_name} ${props.loginUser.last_name}'s account?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleAlertClose} autoFocus color="primary" variant="contained">Cancel</Button>
                <Button onClick={handleDeleteClick} color="secondary">Delete</Button>
              </DialogActions>
            </Dialog>
          </React.Fragment>
        )}

      </Toolbar>
    </AppBar>
  );
}

export default TopBar;