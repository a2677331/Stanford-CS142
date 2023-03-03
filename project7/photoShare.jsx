import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Grid, Typography, Paper } from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/loginRegister/loginRegister';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: null,            // which user the login user is viewing
      loginUser: null,           // use to check if an user is logged
      photoIsUploaded: false
      /**
       * * login user's first name and id
       * * fetched from loginRegister component and pass up to the whole App
       * * for other child componenets use
       *  */ 
    };
  }

  /**
   * To get user name from child component and return back for TopBar to display
   * @param userName user last name and first name
   */
  handleUserNameChange = userName => this.setState({ userName: userName });

  /**
   * To get login user name from child component and return back for TopBar to display
   * @param loginUser user's id and first name
   */
  handleLoginUserChange = loginUser => this.setState({ loginUser: loginUser });

  /**
   * To let child component be notified photos list is updated
   */
  handlePhotoUpload = () => {
    this.setState({ photoIsUploaded: true });  // notify photos list re-render
    this.setState({ photoIsUploaded: false }); // reset the photoIsUploaded variable
  };

  render() {
    const paths = ["/users/:userId", "/photos/:userId", ""]; // paths to render in the Topbar

    return (
      <HashRouter>
        <div>
          <Grid container spacing={1}>
            {/* TopBar View */}
            <Grid item xs={12}>
              <Switch>
                {/* Use paths.map() to populate the same Topbar component for different routes */}
                {paths.map((path) => (
                  <Route key={path} path={path}>
                    {(props) => (
                      <TopBar
                        {...props}
                        onLoginUserChange={this.handleLoginUserChange}
                        onPhotoUpload={this.handlePhotoUpload}
                        userName={this.state.userName}
                        loginUser={this.state.loginUser}
                      />
                    )}
                  </Route>
                ))}
              </Switch>
            </Grid>

            <div className="cs142-main-topbar-buffer" />

            {/* Sidebar View */}
            <Grid item sm={3}>
              <Paper className="side-bar" elevation={3}>
                <UserList loginUser={this.state.loginUser} />
              </Paper>
            </Grid>

            {/* Main View */}
            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item" elevation={3}>
                {/* ALl unauthorized visit would go to login page */}
                <Switch>
                  {/* Login/Register View */}
                  <Route path="/login-register">
                    <LoginRegister
                      onLoginUserChange={this.handleLoginUserChange}
                      loginUser={this.state.loginUser}
                    />
                  </Route>
                  {/* User detail View */}
                  <Route path="/users/:userId">
                    {(props) => (
                      <UserDetail
                        {...props}
                        onUserNameChange={this.handleUserNameChange}
                        loginUser={this.state.loginUser}
                      />
                    )}
                    {/* Pass "props": to use "this.props.match.params" */}
                  </Route>
                  {/* User photo View */}
                  <Route path="/photos/:userId">
                    {(props) => (
                      <UserPhotos
                        {...props}
                        onUserNameChange={this.handleUserNameChange}
                        photoIsUploaded={this.state.photoIsUploaded}
                        loginUser={this.state.loginUser}
                      />
                    )}
                  </Route>
                  {/* User list View */}
                  <Route path="/users">
                    {this.state.loginUser ? (
                      <UserList loginUser={this.state.loginUser} />
                    ) : (
                      <Redirect to={`/login-register`} />
                    )}
                  </Route>
                  {/* Home page View */}
                  <Route path="/">
                    {this.props.loginUser ? (
                      <Typography variant="h3">
                        Welcome to my photosharing app!
                      </Typography>
                    ) : (
                      <Redirect to={`/login-register`} />
                    )}
                  </Route>
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    ); // end of return
  } // end of render
} 

// Create React App
ReactDOM.render(<PhotoShare/>, 
document.getElementById('photoshareapp'));