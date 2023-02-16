import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@material-ui/core';
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
      userName: null,            // user currently viewing
      loginUser: null,           // user that login into the app
      isLoggedIn: false          // if the user is logged in
    };
  }

  /**
   * * Jian Zhong
   * To get user name from child component and return back for TopBar to display
   * @param userName user last name and first name
   */
  handleUserNameChange = userName => {
    this.setState({ userName: userName });
  };

  /**
   * * Jian Zhong
   * To get login user name from child component and return back for TopBar to display
   * @param loginUser user's id and first name
   * @param isLoggedIn if user is logged in
   */
  handleLoginUserChange = (loginUser, isLoggedIn) => {
    this.setState({ 
      loginUser: loginUser,
      isLoggedIn: isLoggedIn,
     });
  };


  render() {
    const paths = ["/users/:userId", "/photos/:userId", ""]; // paths to render Topbar
    return (
      <HashRouter>
      <div>
      <Grid container spacing={1}>

        {/* TopBar View */}
        <Grid item xs={12}>
          <Switch>
            {/* Use paths.map() to populate the same Topbar component for different routes */}
            { 
              paths.map(path => (
                <Route key={path} path={path}>
                  {props => <TopBar {...props} userName={this.state.userName} loginUser={this.state.loginUser} isLoggedIn={this.state.isLoggedIn}/>}
                </Route>
              ))
            }
          </Switch>
        </Grid>

        <div className="cs142-main-topbar-buffer"/>
        
        {/* Sidebar View */}
        <Grid item sm={3}>
        <Paper className="side-bar" elevation={3}>
          <UserList />
        </Paper>
        </Grid>
        
        {/* Main Content View */}
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item" elevation={3}>
            {/* ALl unauthorized visit would go to login page */}
              {
                this.state.isLoggedIn ?
                  (
                    <Switch>
                      {/* Authorized user View */}
                      <Route path="/users/:userId">
                        { props => <UserDetail {...props} handler={this.handleUserNameChange}/> }
                        {/* Pass "props": to use "this.props.match.params" */}
                      </Route>   
                      <Route path="/photos/:userId">
                        { props => <UserPhotos {...props} handler={this.handleUserNameChange}/> }
                      </Route>   
                      <Route path="/users">
                        <UserList />
                      </Route>     
                      <Route path="/">
                        <Typography variant="h3">Welcome to my photosharing app!</Typography>
                      </Route>
                    </Switch>                                                 
                  )
                  :
                  (
                    <>
                      {/* Unauthorized user View */}
                      <Route path="/login-register">
                        {/* Login/Register View */}
                        <LoginRegister handler={this.handleLoginUserChange}/>
                      </Route>
                      <Redirect to="/login-register" />
                    </>
                  )
              }
          </Paper>
        </Grid>   
      </Grid>
      </div>
      </HashRouter>
    ); // end of return
  } // end of render
} 



ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
