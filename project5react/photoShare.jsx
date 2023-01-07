import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
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

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: null,
    };
  }

  /**
   * To get user name from child component and return back for TopBar to display
   * @param userName user last name and first name
   */
  handleUserNameChange = userName => {
    console.log("Receive: ", userName);
    this.setState({ userName: userName });
  };

  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Switch>
            <Route path="/users/:userId" render={ props => <TopBar {...props} userName={this.state.userName}/> }/>
            <Route path="/photos/:userId" render={ props => <TopBar {...props} userName={this.state.userName}/> }/>
            <Route render={ props => <TopBar {...props} userName={this.state.userName}/> }/>
          </Switch>
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="cs142-main-grid-item" elevation={3}>
            <UserList />
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="cs142-main-grid-item" elevation={3}>
            <Switch>
              <Route exact path="/" render={() => (
                <Typography variant="h3">Welcome to my photosharing app!</Typography>
                )}/>
              <Route path="/users/:userId" render={ props => <UserDetail {...props} handler={this.handleUserNameChange}/>} />
              <Route path="/photos/:userId" render ={ props => <UserPhotos {...props} handler={this.handleUserNameChange}/> } />
              <Route path="/users" component={UserList} />
              {/* Route's path uses ":userId" so that component can access that parameter */}
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }

}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
