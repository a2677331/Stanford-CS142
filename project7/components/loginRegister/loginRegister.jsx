import * as React from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";
import { Typography, Grid, FormControl, InputLabel, Input, Button } from "@material-ui/core";

/**
 * * Jian Zhong
 * * Project 7 codes for implementing LoginRegister component
 */


export default class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: "",
      password: "",
      loginMessage: "", // use for prompting login info under login submit button
      newLoginName: "",
      firstName: "",
      lastName: "",
      description: "",
      location: "",
      occupation: "",
      newPassword: "",
      newPassword2: "",
      registeredMessage: "", // use for prompting register info under register submit button
    };
    this.isLogged = null; // use for prompting user when login fails
  }


  // Handle change of login name and password
  handleInputChange = ({ target }) => this.setState({ [target.name]: target.value });


  /**
  * Control login user form sumbit
  * use Axios to send POST request with both login name and password to server
  * * always use Axios to send request and update the users state variable
  * */ 
  handleLoginSubmit = e => { // async: to use "await" inside the func
    e.preventDefault();  // prevent submit form and reload page behavior.
    console.log("** Sending login Info to server: ", this.state.loginName + "  " + this.state.password + " **");

    // construct a login user obj
    const loginUser = {         
      login_name: this.state.loginName, 
      password: this.state.password 
    };  

    // axios to send a POST request with login info
    axios
      .post("/admin/login", loginUser) // POST request sent!
      .then(response => {   // Handle success
        console.log(`** LoginRegister: loggin Success! **`); 
        this.setState({ loginMessage: response.data.message });
        this.props.onLoginUserChange(response.data);  
        // Pass back loggin user data and logged info to TopBar
        // response.data format: { first_name: , _id: }
      })
      .catch(error => {     // Handle error
        console.log(`** LoginRegister: loggin Fail! **`); 
        console.log(error.response.data.message);
        this.setState({ loginMessage: error.response.data.message });
        this.props.onLoginUserChange(null);  
        // Pass back info to TopBar
      });
  };

  /**
   * To construct new user obj and clear old inputs.
   * @returns a new user object for sending to server
   */
  getNewUser() {
    // construct a new user obj
    const newUser = {
      login_name: this.state.newLoginName, 
      password: this.state.newPassword,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      location: this.state.location,
      description: this.state.description,
      occupation: this.state.occupation
    };  
    
    // clear register inputs
    this.setState({ 
      newLoginName: "", 
      newPassword: "",
      newPassword2: "",
      firstName: "",
      lastName: "",
      location: "",
      description: "",
      occupation: "",
    });
    return newUser;
  }

  /**
  * Control new user form sumbit
  * use Axios to send POST request to server to register a new user
  * */ 
  handleRegisterSubmit = e => {
    e.preventDefault();

    // make sure the two passwords entered are the same
    if (this.state.newPassword !== this.state.newPassword2) {
      this.setState({ registeredMessage: "The two passwords are NOT the same, please try again" }); // update message prompt to indicate user
      return;
    }
    const newUser = this.getNewUser();
    console.log(newUser);
    
    // axios to send a POST request with login info
    axios
      .post("/user", newUser) // POST request sent!
      .then(response => {   // Handle success
        console.log(`** LoginRegister: new User register Success! **`); 
        this.setState({ registeredMessage: response.data.message }); // update message prompt to indicate user
      })
      .catch(error => {     // Handle error
        console.log(`** LoginRegister: new User loggin Fail! **`); 
        this.setState({ registeredMessage: error.response.data.message }); // update error prompt to indicate user
      });
  };


  customForm(inputLabel, id, type, value, required, autoFocus = false) {
     return (
       <FormControl fullWidth>
         <InputLabel htmlFor={id}>{inputLabel}</InputLabel>
         <Input
           name={id}
           id={id}
           autoFocus={autoFocus}
           autoComplete="on"
           type={type}
           value={value}
           onChange={this.handleInputChange}
           required={required}
         />
       </FormControl>
     );
  }
  

  render() {
    // Handle jumping into the login User's detail page if user is authorizedx
    const loginUser = this.props.loginUser;
    if (loginUser) {
      return <Redirect from="/login-register" to={`/users/${loginUser._id}`} />;
       // the state prop in <Redirect> is used to pass data between components when using client-side routing
    }

    // else, show login page:
    return (
      <Grid container >

        {/* Login Form */}
        <Grid container item direction="column" alignItems="center" xs={6}>
          {/* Welcome prompt */}
          <Typography variant="h5">Log In</Typography>
          {/* login inputs */}
          <Grid item xs={8}>
            <form onSubmit={this.handleLoginSubmit}>
              {this.customForm("Login Name", "loginName", "text", this.state.loginName, true, true)}
              {this.customForm("Password", "password", "password", this.state.password, true)}
              <br/><br/>
              <Button
                type="submit"
                disabled={this.state.loginName.length === 0}
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
              <br/><br/>
              {this.state.loginMessage && (
                <Typography style={{ color: "red" }}>
                  {this.state.loginMessage}
                </Typography>
              )}
            </form>
          </Grid>
        </Grid>

        {/* Register Form */}
        <Grid container item direction="column" alignItems="center" xs={6}>
          {/* Welcome prompt */}
          <Typography variant="h5">Create New Account</Typography>
          {/* Register inputs */}
          <Grid item xs={8}>
            <form onSubmit={this.handleRegisterSubmit}>
              {this.customForm("New Login Name*", "newLoginName", "text", this.state.newLoginName, true)}
              {this.customForm("First Name*", "firstName", "text", this.state.firstName, true)}
              {this.customForm("Last Name*", "lastName", "text", this.state.lastName, true)}
              {this.customForm("Description", "description", "text", this.state.description)}
              {this.customForm("Location", "location", "text", this.state.location)}
              {this.customForm("Occupation", "occupation", "text", this.state.occupation)}
              {this.customForm("New Password*", "newPassword", "password", this.state.newPassword, true)}
              {this.customForm("Re-enter Password*", "newPassword2", "password", this.state.newPassword2, true)}
              <br/><br/>
              <Button
                type="submit"
                disabled={this.state.newLoginName.length === 0}
                fullWidth
                variant="contained"
                color="primary"
              >
                Register Me
              </Button>
              <br/><br/>
              {this.state.registeredMessage && (
                <Typography style={{ color: this.state.registeredMessage.includes("successfully") ? "green" : "red" }}>
                  {this.state.registeredMessage}
                </Typography>
              )}

              {/* The two passwords are not the same prompt */}
            </form>
          </Grid>
        </Grid>

      </Grid>
    );
  }
}