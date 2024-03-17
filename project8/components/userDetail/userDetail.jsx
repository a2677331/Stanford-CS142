import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import "./userDetail.css";
import axios from "axios";


/**
 * * Jian Zhong
 * Define UserDetail, a React componment of CS142 project #5
 */
function UserDetail(props) {
  const [user, setUser] = useState(null); // to receive user detail data from server

  // Use Axios to send request and update the user state variable.
  const axios_fetchData = url => {
    axios
      .get(url)
      .then(response => {
        props.onUserNameChange(response.data.first_name + " " + response.data.last_name); // handle TopBar user name change
        // handle page refresh, project 7 extra credit
        props.onLoginUserChange({first_name: response.data.logged_user_first_name,}); // to know who is current logged user after refresh
        setUser(response.data);  // to display user detail data
        console.log("** UserDetail: fetched user detail **");
      })
      .catch(error => {
        console.log("** Error in UserDetail **\n", error.message);
      }); // Handle error:
  };


  /**
   * load data user when clicked on different user on the sidebar user list and show the user's detail
   * * Project 7 extra credit: works when first load or refreshing the page.
   */
  useEffect(() => {
    axios_fetchData(`/user/${props.match.params.userId}`);
  }, [props.match.params.userId]);


  // * Note: need to add "|| !this.state.user" so that after 
  // * redirecting to another page, this.state.user
  // * won't be accessed on another page,
  // * else it will cause unmount error in browser's console 
  if (props.loginUser || !user) {
    return user && (
      <Grid container>
        <Grid item xs={12}>
          <Typography color="textSecondary">Name:</Typography>
          <Typography variant="h6" gutterBottom>
            {`${user.first_name} ${user.last_name}`}
          </Typography>
          <Typography color="textSecondary">Description:</Typography>
          <Typography variant="h6" gutterBottom>
            {`${user.description}`}
          </Typography>
          <Typography color="textSecondary">Location:</Typography>
          <Typography variant="h6" gutterBottom>
            {`${user.location}`}
          </Typography>
          <Typography color="textSecondary">Occupation:</Typography>
          <Typography variant="h6" gutterBottom>
            {`${user.occupation}`}
          </Typography>
        </Grid>
        <Grid item xs={4} />
        <Grid item xs={4}>
          <Button
            size="large"
            to={user && `/photos/${user._id}`}
            component={Link}
            variant="contained"
            style={{ backgroundColor: "#f9bc60" }}
          >
            See Photos
          </Button>
        </Grid>
        <Grid item xs={4} />
      </Grid>
    );
  } else {
    return <Redirect to={`/login-register`} />;
  }
}

export default UserDetail;





















// * Below is code implemented using class component:


// /**
//  * * Jian Zhong
//  * Define UserDetail, a React componment of CS142 project #5
//  */
// class UserDetail2 extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       user: null, // to receive user detail data from server
//     };
//   }

//   // Use Axios to send request and update the user state variable.
//   axios_fetchData(url) {
//     axios
//       .get(url)
//       .then(response => {
//         this.props.onUserNameChange( response.data.first_name + " " + response.data.last_name ); // handle TopBar user name change
//         // handle page refresh, project 7 extra credit
//         this.props.onLoginUserChange({      
//           first_name: response.data.logged_user_first_name, // to know who is current logged user after refresh
//         });
//         this.setState({ user: response.data }); // to display user detail data
//         console.log("** UserDetail: fetched user detail **");
//       })
//       .catch(error => {     // Handle error:
//         console.log("** Error in UserDetail **\n", error.message);
//       });
//   }
  

//   // load data when page first load or refresh the page, project 7 extra credit
//   componentDidMount() {
//     this.axios_fetchData(`/user/${this.props.match.params.userId}`);
//   }

//   /**
//    * load data user when clicked on different user on the sidebar user list and show the user's detail
//    * * component is not re-rendering when the route changes, componentDidUpdate() can detect route changes.
//    */
//   componentDidUpdate(prevProps) {
//     const prevUserID = prevProps.match.params.userId;
//     const currUserID = this.props.match.params.userId;
//     if (prevUserID !== currUserID && currUserID) {
//       this.axios_fetchData(`/user/${currUserID}`);
//     }
//   }

//   render() {
//     // * Note: need to add "|| !this.state.user" so that after 
//     // * redirecting to another page, this.state.user
//     // * won't be accessed on another page,
//     // * else it will cause unmount error in browser's console 
//     if (this.props.loginUser || !this.state.user) {
//       return this.state.user && (
//         <Grid container>
//           <Grid item xs={12}>
//             <Typography color="textSecondary">Name:</Typography>
//             <Typography variant="h6" gutterBottom>
//               {`${this.state.user.first_name} ${this.state.user.last_name}`}
//             </Typography>
//             <Typography color="textSecondary">Description:</Typography>
//             <Typography variant="h6" gutterBottom>
//               {`${this.state.user.description}`}
//             </Typography>
//             <Typography color="textSecondary">Location:</Typography>
//             <Typography variant="h6" gutterBottom>
//               {`${this.state.user.location}`}
//             </Typography>
//             <Typography color="textSecondary">Occupation:</Typography>
//             <Typography variant="h6" gutterBottom>
//               {`${this.state.user.occupation}`}
//             </Typography>
//           </Grid>
//           <Grid item xs={4} />
//           <Grid item xs={4}>
//             <Button
//               size="large"
//               to={this.state.user && `/photos/${this.state.user._id}`}
//               component={Link}
//               variant="contained"
//               style={{ backgroundColor: "#f9bc60" }}
//             >
//               See Photos
//             </Button>
//           </Grid>
//           <Grid item xs={4} />
//         </Grid>
//       );
//     } else {
//       return <Redirect to={`/login-register`} />;
//     }

//   }
// }