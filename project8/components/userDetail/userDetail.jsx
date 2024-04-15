import React, { useState, useEffect, useNavigate } from "react";
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
        props.onLoginUserChange({ first_name: response.data.logged_user_first_name,
                                   last_name: response.data.logged_user_last_name,
                                          id: response.data.logged_user_id, }); // handle page refresh, project 7 extra credit, to know who is current logged user after refresh
        setUser(response.data);  // to display user detail data
      })
      .catch(error => {
        console.log("** Error in UserDetail **\n", error.message);
      }); // Handle error:
  };

  /**
   * * The useEffect runs whenever user name is clicked (site address changes),
   * * a specific user detail page will be rendered.
   * * Project 7 extra credit: works when first load or refreshing the page.
   */
  useEffect(() => {
    // If the URL parameter is dfined, fetch the specified user's data
    axios_fetchUserFrom(`/user2/${props.match.params.userId}`);
  }, [props.match.params.userId]);



  // * Note: need to add "!user" so that after 
  // * redirecting to another page, user
  // * won't be accessed on another page,
  // * else it will cause unmount error in browser's console 
  if (props.loginUser || !user) {
    return (
      user && (
        <Grid container>

          {/* User basic info */}
          <Grid item xs={12}>
            <Typography color="textSecondary">Name:</Typography>
            <Typography variant="h6" gutterBottom>{`${user.first_name} ${user.last_name}`}</Typography>
            <Typography color="textSecondary">Description:</Typography>
            <Typography variant="h6" gutterBottom>{`${user.description}`}</Typography>
            <Typography color="textSecondary">Location:</Typography>
            <Typography variant="h6" gutterBottom>{`${user.location}`}</Typography>
            <Typography color="textSecondary">Occupation:</Typography>
            <Typography variant="h6" gutterBottom>{`${user.occupation}`}</Typography>
          </Grid>

            {/* Only show if user has any photos posted, most commented photo and most recently uploaded photo */}
            {user.mostRecentPhotoName && (
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
                    <Typography variant="body2">
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
                    <Typography variant="body2">
                        {`${user.commentsCount} comment${user.commentsCount >= 2 ? "s" : ""}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid> 
            )}
         
         {/* Button for Seeing all user photo */}
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