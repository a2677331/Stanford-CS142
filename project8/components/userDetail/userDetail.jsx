import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Button, Grid, Typography, Avatar} from "@material-ui/core";
import "./userDetail.css";
import axios from "axios";

import {
  List,
  Divider,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
} from "@material-ui/core";

import { ThumbUpOutlined } from "@material-ui/icons";


/**
 * * Jian Zhong
 * Define UserDetail, a React componment of CS142 project #5
 */
function UserDetail(props) {
  const [user, setUser] = useState(null); // to receive user detail data from server
  // const [mostRecentPhoto, setMostRecentPhoto] = useState(null); 
  // const [mostCommentedPhoto, setmostCommentedPhoto] = useState(null); 

  // Use Axios to send request and update the user state variable.
  const axios_fetchUserFrom = url => {
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
    axios_fetchUserFrom(`/user/${props.match.params.userId}`);
  }, [props.match.params.userId]);


  // * Note: need to add "|| !this.state.user" so that after 
  // * redirecting to another page, this.state.user
  // * won't be accessed on another page,
  // * else it will cause unmount error in browser's console 
  const imageURL = "https://www.wikihow.com/images/thumb/c/ce/Make-Thumbnails-Step-1-Version-3.jpg/v4-728px-Make-Thumbnails-Step-1-Version-3.jpg";

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

            <Typography color="textSecondary">Most Recently Uploaded Photo:</Typography>
            
            <Button to={user && `/photos/${user._id}`} component={Link} >
              <Card style={{ border: "2px solid black", maxWidth: 450, display: 'flex', justifyContent: 'center'}} >
                <CardMedia style={{ border: "1px solid black" }} component="img" image={`./images/${user.mostRecentPhotoName}`} alt="Anthor Post"/>
                <CardContent>
                  <Typography variant="body2">
                    Upload Date:
                  </Typography>
                  <Divider/>
                  {`${user.mostRecentPhotoDate}`}
                </CardContent>
              </Card>
            </Button>

            <Typography color="textSecondary">Most Commented Photo:</Typography>
            <Button to={user && `/photos/${user._id}`} component={Link}>
              <Card style={{ border: "2px solid black", maxWidth: 450, display: 'flex', justifyContent: 'center' }}>
                <CardMedia style={{ border: "1px solid black" }} component="img" image={`./images/${user.mostCommentedPhotoName}`} alt="Anthor Post"/>
                <CardContent>
                  <Typography variant="body2">
                    {`Comments Count: ${user.commentsCount}`}
                  </Typography>
                </CardContent>
              </Card>
            </Button>
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
              See All Photos
            </Button>
          </Grid>
          <Grid item xs={4} />
        </Grid>
      )
    );
  } else {
    return <Redirect to={`/login-register`} />;
  }
}

export default UserDetail;