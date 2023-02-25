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
    };
    this.isLogged = null; // use for prompting user when login fails
  }


  // Handle change of login name and password
  handleInputChange = ({ target }) => this.setState({ [target.name]: target.value });


  /**
  * Control form sumbit
  * use Axios to send POST request with both login name and password to server
  * * always use Axios to send request and update the users state variable
  * */ 
  handleLoginSubmit = event => { // async: to use "await" inside the func
    event.preventDefault();  // prevent submit form and reload page behavior.
    console.log("Sending login Info to server: ", this.state.loginName + "  " + this.state.password);

    // axios to send a POST request with login info
    const url = "/admin/login"; // server endpoint for login
    const loginInfo = {         // login info to server
      login_name: this.state.loginName, 
      password: this.state.password 
    };  

    axios
      .post(url, loginInfo) // POST request sent!
      .then(response => {   // Handle success
        console.log(`LoginRegister loggin Success!`); 
        this.isLogged = true;  
        this.props.onLoginUserChange(response.data);  // for passing loggin user data and logged info back to TopBar
      })
      .catch(error => {     // Handle error
        console.log(`LoginRegister loggin Fail!`); 
        this.isLogged = false;     
        this.props.onLoginUserChange(null);  // for passing loggin user's first name and logged info back to TopBar
        console.log(error);
      });
  };
  

  render() {

    // Handle jumping into the login User's detail page if user is authorizedx
    const loginUser = this.props.loginUser;
    if (loginUser) {
      return <Redirect from="/login-register" to={`/users/${loginUser._id}`} />;
       // the state prop in <Redirect> is used to pass data between components when using client-side routing
    }

    // else, show login page:
    return (
      <Grid container direction="column" alignItems="center">
        {/* Welcome prompt */}
        <Grid item>
          <Typography variant="h5">Welcome to Fakebook!</Typography>
        </Grid>
        <br/>
        {/* Login Form */}
        <Grid item xs={5}>
          <form onSubmit={this.handleLoginSubmit}>
            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor="loginName">Login Name:</InputLabel>
              <Input name="loginName" id="loginName" autoFocus value={this.state.loginName} onChange={this.handleInputChange}/>
            </FormControl>
            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor="password">Password:</InputLabel>
              <Input name="password" id="password" type="password" value={this.state.password} onChange={this.handleInputChange}/>
            </FormControl>
            <br/><br/>
            <Button type="submit" disabled={this.state.loginName.length === 0} fullWidth variant="contained" color="primary">Login</Button>
            { this.isLogged === false && <Typography style={{ color: "red" }}>Not a valid login name, try again</Typography> }
          </form>
        </Grid>
      </Grid>
    );
  }
}