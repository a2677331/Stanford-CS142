import React from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import "./userDetail.css";
import axios from "axios";


/**
 * * Jian Zhong
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null, // to receive user detail data from server
    };
  }

  // Use Axios to send request and update the user state variable.
  axios_fetchData(url) {
    axios
    .get(url)
    .then(response => { // Handle success:

      // handle current page refresh
      this.props.onLoginUserChange({  // ! why refresh will have error in console ?????????????????????????????????? 
        first_name: response.data.first_name, 
        _id: response.data._id,
      });

      this.props.onUserNameChange( response.data.first_name + " " + response.data.last_name ); // handle TopBar user name change
      this.setState({ user: response.data }); // to display user detail data
      console.log("** UserDetail: fetched user detail **");
    })
    .catch(error => {     // Handle error:
      console.log("** Error in UserDetail **\n", error.message);
    });
  }

  // load data when page first load or refresh the page
  componentDidMount() {
    console.log("DID Mount");
    // Make request to server only when there is id
    if (this.props.match.params.userId) {
      console.log("did has user id: ", this.props.match.params.userId);
      console.log("login User: ", this.props.loginUser);
      const url = `/user/${this.props.match.params.userId}`;
      this.axios_fetchData(url);
    }
  }

  /**
   * load data user click on different user list and show the user's detail
   * ! component is not re-rendering when the route changes, componentDidUpdate() can detect route changes.
   */
  componentDidUpdate(prevProps) {
    const prevUserID = prevProps.match.params.userId;
    const currUserID = this.props.match.params.userId;
    if (prevUserID !== currUserID && currUserID) {
      const url = `/user/${currUserID}`;
      this.axios_fetchData(url);
    }
  }

  render() {
    // redirect to login page if not logged in
    if (!this.props.loginUser) {
      return <Redirect to={`/login-register`} />;
    }

    return this.state.user && (
      <Grid container>
        <Grid item xs={12}>
          <Typography color="textSecondary">Name:</Typography>
          <Typography variant="h6" gutterBottom>
            {`${this.state.user.first_name} ${this.state.user.last_name}`}
          </Typography>
          <Typography color="textSecondary">Description:</Typography>
          <Typography variant="h6" gutterBottom>
            {`${this.state.user.description}`}
          </Typography>
          <Typography color="textSecondary">Location:</Typography>
          <Typography variant="h6" gutterBottom>
            {`${this.state.user.location}`}
          </Typography>
          <Typography color="textSecondary">Occupation:</Typography>
          <Typography variant="h6" gutterBottom>
            {`${this.state.user.occupation}`}
          </Typography>
        </Grid>
        <Grid item xs={4} />
        <Grid item xs={4}>
          <Button
            size="large"
            to={this.state.user && `/photos/${this.state.user._id}`}
            component={Link}
            variant="contained"
            color="primary"
          >
            See Photos
          </Button>
        </Grid>
        <Grid item xs={4} />
      </Grid>
    );
  }
}

export default UserDetail;
