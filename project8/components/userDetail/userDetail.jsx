import React, { useState, useEffect } from "react";
import {
  Button, 
  Grid, 
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
} from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import "./userDetail.css";
import axios from "axios";



/**
 * * Jian Zhong
 * Define UserDetail, a React componment of CS142 project #5
 */
function UserDetail(props) {
  const [user, setUser] = useState(null); // to receive user detail data from server

  // Use Axios to send request and update the user state variable.
  const axios_fetchUserFrom = url => {
    axios
      .get(url)
      .then(response => {
        props.onUserNameChange(response.data.first_name + " " + response.data.last_name); // handle TopBar user name change
        props.onLoginUserChange({ first_name: response.data.logged_user_first_name }); // handle page refresh, project 7 extra credit, to know who is current logged user after refresh
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
    axios_fetchUserFrom(`/user/${props.match.params.userId}`);
  }, [props.match.params.userId]);


  // * Note: need to add "|| !this.state.user" so that after 
  // * redirecting to another page, this.state.user
  // * won't be accessed on another page,
  // * else it will cause unmount error in browser's console 
  if (props.loginUser || !user) {
    return (
      user && (
        <Grid container>
          <Grid item xs={12}>
            <Typography color="textSecondary">Name:</Typography>
            <Typography variant="h6" gutterBottom="">{`${user.first_name} ${user.last_name}`}</Typography>
            <Typography color="textSecondary">Description:</Typography>
            <Typography variant="h6" gutterBottom>{`${user.description}`}</Typography>
            <Typography color="textSecondary">Location:</Typography>
            <Typography variant="h6" gutterBottom>{`${user.location}`}</Typography>
            <Typography color="textSecondary">Occupation:</Typography>
            <Typography variant="h6" gutterBottom>{`${user.occupation}`}</Typography>
          </Grid>

            <Grid item xs={12} style={{ display: "flex", margin: "20px auto", justifyContent: 'center' }}>
              <Card style={{ maxWidth: 250, margin: "0 20px" }}>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">Most Recently Uploaded Photo</Typography>
                </CardContent>
                <CardActionArea to={user && `/photos/${user._id}`} component={Link}>
                  <CardMedia
                    component="img"
                    image={`./images/${user.mostRecentPhotoName}`}
                    alt="photo"
                  />
                </CardActionArea>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {`Date Uploaded`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {`${user.mostRecentPhotoDate}`}
                  </Typography>
                </CardContent>
              </Card>
              <Card style={{ maxWidth: 250, margin: "0 20px" }}>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">Most Commented Photo</Typography>
                </CardContent>
                <CardActionArea to={user && `/photos/${user._id}`} component={Link}>
                  <CardMedia
                    component="img"
                    image={`./images/${user.mostCommentedPhotoName}`}
                    alt="photo"
                  />
                </CardActionArea>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                      {`Comments Count: ${user.commentsCount}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
         
          <Grid item style={{margin: "20px auto"}}>
            <Button
              size="large"
              to={user && `/photos/${user._id}`}
              component={Link}
              variant="contained"
              style={{ backgroundColor: "#f9bc60" }}
            >
              See All Photos
            </Button>
          </Grid>

        </Grid>
      )
    );
  } else {
    return <Redirect to={`/login-register`} />;
  }
}

export default UserDetail;