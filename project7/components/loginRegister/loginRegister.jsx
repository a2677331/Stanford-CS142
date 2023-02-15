import * as React from "react";
import { Redirect } from 'react-router-dom';
import axios from "axios";
import { Typography, Grid } from "@material-ui/core";

/**
 * * Jian Zhong
 * * Project 7 codes for implementing LoginRegister component
 */

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginName: "",
      password: "",
      isLoggedIn: undefined,
      loggedIn_user: undefined,
    };
  }


  // Contorl change of password
  handleInputChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };


  /**
  * Control form sumbit
  * use Axios to send POST request with both login name and password to server
  * ! always use Axios to send request and update the users state variable
  * */ 
  handleLoginSubmit = (event) => { // async: to use "await" inside the func
    event.preventDefault();  // prevent submit form and reload page behavior.
    console.log("Sending loginInfo to server: ", this.state.loginName + "  " + this.state.password);

    const url = "/admin/login"; // server endpoint for login
    const loginInfo = {         // login info to server
      login_name: this.state.loginName, 
      password: this.state.password 
    };  

    // axios to send a POST request with login info
    axios
      .post(url, loginInfo) // POST request sent!
      .then(response => {   // Handle success
        this.setState({ isLoggedIn: true, loggedIn_user: response.data }); // update user's first name and logged info
        this.props.handler(response.data, true);  // for passing loggin user data and logged info back to TopBar
        console.log(`** Success from LoginRegister: receved 200 response **`, response); 
      })
      .catch(error => {     // Handle error
        this.setState({ isLoggedIn: false, loggedIn_user: null }); // update user's first name and logged info
        this.props.handler(null, false);  // for passing loggin user's first name and logged info back to TopBar
        console.log(`** Error from LoginRegister: receved 400 response **`, error); 
        console.log(error);
      });
  };
  

  render() {
    // Within login page, if user is authorized, redirect to that user's detail page.
    if (this.state.isLoggedIn) {
      return <Redirect to={`/users/${this.state.loggedIn_user._id}`} />;
    }

    // else, just display login page.
    return (
      <Grid container direction="column" alignItems="center" style={{ minHeight: '40vh' }}>

        <Grid item>
          <Typography variant="h5">Welcome to Fakebook!</Typography>
        </Grid>
        <br/>

        <Grid item xs={8}>
            <form onSubmit={this.handleLoginSubmit}>
              <label>
                Login Name:
                <input
                  name="loginName"
                  type="text"
                  value={this.state.loginName}
                  onChange={this.handleInputChange}
                />
              </label>
              <br/>
              <label>
                Password:
                <input
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                />
              </label>
              <br/>
              <button type="submit">Login</button>
              <br/><br/>
              {
                this.state.isLoggedIn === false ?
                  <Typography style={{ color: "red" }}>Not a valid login name, try again</Typography>
                  :
                  <Typography>{}</Typography>
              }
            </form>
        </Grid>

      </Grid>
    );
  }
}

export default LoginRegister;