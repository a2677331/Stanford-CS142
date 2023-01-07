import React from "react";
import { Link } from "react-router-dom";
import { Button, Box, Grid, Typography } from "@material-ui/core";
import "./userDetail.css";
import { server } from "../../lib/fetchModelData";



/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  // load data when page first load or refreash
  componentDidMount() {
    if (this.props.match.params.userId) { // only when there is id
      const userUrl = `http://localhost:3000/user/${this.props.match.params.userId}`;
      server.fetchModel(userUrl).then(response => { 
        this.setState({ user: response.data });
        this.props.handler(response.data.first_name + ' ' + response.data.last_name);
      });
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
      const UrlToLoad = `http://localhost:3000/user/${currUserID}`;
      server.fetchModel(UrlToLoad).then(response => { 
        this.setState({ user: response.data });
        this.props.handler(response.data.first_name + ' ' + response.data.last_name);
      });
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
        <Grid item xs={4}/>
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
        <Grid item xs={4}/>
      </Grid>
    ) : (
      <Box sx={{ minWidth: 300 }}>Loading...</Box>
    );
  }
}

export default UserDetail;
