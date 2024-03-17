import React, { useState, useEffect }  from "react";
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Grid, Paper } from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';
import LoginRegister from './components/loginRegister/loginRegister';


function PhotoShare() {
  const [photoIsUploaded, setPhotoIsUploaded] = useState(false);
  const [userName, setUserName] = useState(null);     // which user the login user is currently viewing

  /**
   * * login user's first name and id
   * * fetched from loginRegister component and pass up to the whole App
   * * and for other child componenets use
   *  */ 
  const [loginUser, setLoginUser] = useState(null);   // use to check if an user is logged
 
  
  /**
   * To get user name from child component and return back for TopBar to display
   * @param name user last name and first name
   */
  const handleUserNameChange = name => setUserName(name);

  /**
   * To get login user name from child component and return back for TopBar to display
   * @param user loging user's id and first name
   */
  const handleLoginUserChange = user => setLoginUser(user);

  /**
   * To let child component be notified photos list is updated
   */
  const handlePhotoUpload = () => {
    setPhotoIsUploaded(true);  // notify photos list re-render
    setPhotoIsUploaded(false); // reset the photoIsUploaded variable
  };


  // Rendering components:
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
                  {props => (
                    <TopBar
                      {...props}
                      onLoginUserChange={handleLoginUserChange}
                      onPhotoUpload={handlePhotoUpload}
                      userName={userName}
                      loginUser={loginUser}
                    />
                  )}
                </Route>
              ))}
            </Switch>
          </Grid>
          <div className="cs142-main-topbar-buffer" />

          {/* Sidebar View */}
          <Grid item sm={3} >
            <Paper className="side-bar" elevation={3} style={{ backgroundColor: "#abd1c6", margin: '3%', border: "4px solid black" }}>
              <UserList loginUser={loginUser} />
            </Paper>
          </Grid>

          {/* Main View */}
          <Grid item sm={9} >
            <Paper className="cs142-main-grid-item" elevation={3} style={{ backgroundColor: "#abd1c6", height: '100%', marginTop: '1%', marginRight: '2%', border: "4px solid black" }}>
              {/* ALl unauthorized visit would go to login page */}
              <Switch>
                {/* User detail View */}
                <Route path="/users/:userId">
                  {props => (
                    <UserDetail
                      {...props}
                      onUserNameChange={handleUserNameChange}
                      onLoginUserChange={handleLoginUserChange}
                      loginUser={loginUser}
                    />
                  )}
                  {/* Pass "props": to use "this.props.match.params" */}
                </Route>
                {/* User photo View */}
                <Route path="/photos/:userId">
                  {props => (
                    <UserPhotos
                      {...props}
                      onUserNameChange={handleUserNameChange}
                      onLoginUserChange={handleLoginUserChange}
                      loginUser={loginUser}
                      photoIsUploaded={photoIsUploaded}
                    />
                  )}
                </Route>
                {/* Login/Register View */}
                <Route path="/login-register">
                  <LoginRegister
                    onLoginUserChange={handleLoginUserChange}
                    loginUser={loginUser}
                  />
                </Route>                  
                {/* All the other addresses will go to login page */}
                <Route>
                  <Redirect to={`/login-register`} />
                </Route>
              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </HashRouter>
  ); // end of return
}


// Create React App
ReactDOM.render(<PhotoShare/>, document.getElementById('photoshareapp'));


















// class PhotoShare extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       photoIsUploaded: false,
//       userName: null,            // which user the login user is currently viewing
//       loginUser: null,           // use to check if an user is logged
//       /**
//        * * login user's first name and id
//        * * fetched from loginRegister component and pass up to the whole App
//        * * and for other child componenets use
//        *  */ 
//     };
//   }

//   /**
//    * To get user name from child component and return back for TopBar to display
//    * @param userName user last name and first name
//    */
//   handleUserNameChange = userName => this.setState({ userName: userName });

//   /**
//    * To get login user name from child component and return back for TopBar to display
//    * @param loginUser user's id and first name
//    */
//   handleLoginUserChange = loginUser => this.setState({ loginUser: loginUser });

//   /**
//    * To let child component be notified photos list is updated
//    */
//   handlePhotoUpload = () => {
//     this.setState({ photoIsUploaded: true });  // notify photos list re-render
//     this.setState({ photoIsUploaded: false }); // reset the photoIsUploaded variable
//   };

//   render() {
//     const paths = ["/users/:userId", "/photos/:userId", ""]; // paths to render in the Topbar

//     return (
//       <HashRouter>
//         <div>
//           <Grid container spacing={1}>
            
//             {/* TopBar View */}
//             <Grid item xs={12}>
//               <Switch>
//                 {/* Use paths.map() to populate the same Topbar component for different routes */}
//                 {paths.map((path) => (
//                   <Route key={path} path={path}>
//                     {props => (
//                       <TopBar
//                         {...props}
//                         onLoginUserChange={this.handleLoginUserChange}
//                         onPhotoUpload={this.handlePhotoUpload}
//                         userName={userName}
//                         loginUser={loginUser}
//                       />
//                     )}
//                   </Route>
//                 ))}
//               </Switch>
//             </Grid>
//             <div className="cs142-main-topbar-buffer" />

//             {/* Sidebar View */}
//             <Grid item sm={3} >
//               <Paper className="side-bar" elevation={3} style={{ backgroundColor: "#abd1c6", margin: '3%', border: "4px solid black" }}>
//                 <UserList loginUser={loginUser} />
//               </Paper>
//             </Grid>

//             {/* Main View */}
//             <Grid item sm={9} >
//               <Paper className="cs142-main-grid-item" elevation={3} style={{ backgroundColor: "#abd1c6", height: '100%', marginTop: '1%', marginRight: '2%', border: "4px solid black" }}>
//                 {/* ALl unauthorized visit would go to login page */}
//                 <Switch>
//                   {/* User detail View */}
//                   <Route path="/users/:userId">
//                     {props => (
//                       <UserDetail
//                         {...props}
//                         onUserNameChange={this.handleUserNameChange}
//                         onLoginUserChange={this.handleLoginUserChange}
//                         loginUser={loginUser}
//                       />
//                     )}
//                     {/* Pass "props": to use "this.props.match.params" */}
//                   </Route>
//                   {/* User photo View */}
//                   <Route path="/photos/:userId">
//                     {props => (
//                       <UserPhotos
//                         {...props}
//                         onUserNameChange={this.handleUserNameChange}
//                         onLoginUserChange={this.handleLoginUserChange}
//                         loginUser={loginUser}
//                         photoIsUploaded={photoIsUploaded}
//                       />
//                     )}
//                   </Route>
//                   {/* Login/Register View */}
//                   <Route path="/login-register">
//                     <LoginRegister
//                       onLoginUserChange={this.handleLoginUserChange}
//                       loginUser={loginUser}
//                     />
//                   </Route>                  
//                   {/* All the other addresses will go to login page */}
//                   <Route>
//                     <Redirect to={`/login-register`} />
//                   </Route>
//                 </Switch>
//               </Paper>
//             </Grid>
//           </Grid>
//         </div>
//       </HashRouter>
//     ); // end of return
//   } // end of render
// }  // end of PhotoShare Class

// // Create React App
// ReactDOM.render(<PhotoShare/>, document.getElementById('photoshareapp'));