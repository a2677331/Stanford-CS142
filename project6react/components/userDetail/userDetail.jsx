import React from "react";
import { Link } from "react-router-dom";
import { Button, Box, Grid, Typography } from "@material-ui/core";
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
      user: null,
    };
  }

  // Use Axios to send request and update the user state variable.
  fetchData_axios(url) {
    axios.get(url)
    .then((response) => {
      // Handle success:
      console.log("** Succes: fetched data from " + url + " **");
      this.setState({ user: response.data });
      this.props.handler( response.data.first_name + " " + response.data.last_name );
    })
    .catch((error) => {
      // Handle error:
      if (error.response) {
        // if status code from server is out of the range of 2xx.
        console.log("** Error: status code from server is out of the range of 2xx. **\n", error.response.status);
      } else if (error.request) {
        // if request was made and no response was received.
        console.log("** Error: request was made and no response was received. **\n", error.request);
      } else {
        // something happened in the setting up the request
        console.log("** Error: something happened in the setting up the request. **\n", error.message);
      }
    });
  }

  // load data when page first load or refreash
  componentDidMount() {
    // Make request to server only when there is id
    if (this.props.match.params.userId) {
      const url = `http://localhost:3000/user/${this.props.match.params.userId}`;
      this.fetchData_axios(url);
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
      const url = `http://localhost:3000/user/${currUserID}`;
      this.fetchData_axios(url);
    }
  }

  render() {
    return this.state.user ? (
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
    ) : (
      <Box sx={{ minWidth: 300 }}>
        Loading User Detail on &quot;userDetail.jsx&quot;
      </Box>
    );
  }
}

export default UserDetail;
