import React, { useState, useEffect }  from "react";
import { Link, Redirect } from "react-router-dom";
import {
  List,
  Divider,
  Typography,
  Grid,
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
} from "@material-ui/core";
import { ThumbUpOutlined } from "@material-ui/icons";
import "./userPhotos.css";
import axios from "axios";
import CommentDialog from "../commentDialog/commentDialog";


/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
function UserPhotos(props) {
  const [photos, setPhotos] = useState(null);
  const [user, setUser] = useState(null);

  /**
   * use axios to get photos data and photo's Author data
   * from user ID
   */
  const axios_fetch_photos_and_user = () => {
    // To get photos' Author data
    axios
      .get(`/user/${props.match.params.userId}`) // user url
      .then(response => {
        setUser(response.data);
        props.onUserNameChange(
          response.data.first_name + " " + response.data.last_name
        ); // handle TopBar user name change
        props.onLoginUserChange({
          // handle page refresh
          first_name: response.data.logged_user_first_name, // to know who is current logged user after refresh
        });
        console.log("** UserPhotos: fetched User Photos **");
      })
      .catch( err => console.log("/user/ Error: ", err) );

    // To get user's photos
    axios
      .get(`/photosOfUser/${props.match.params.userId}`) // photo url
      .then( response => setPhotos(response.data) )
      .catch( err => console.log("/photosOfUser/ Error: ", err) );
  };

  /**
   * Update user photos and user data when clickinhg the "See Photo" button under an author.
   * If a new photo is added, re-render will add new uploaded photos.
   * @param props.photoIsUploaded: if a new photo was updated
   */
    useEffect(() => {
      axios_fetch_photos_and_user();
    }, [props.photoIsUploaded]);

  /**
   * To re-fetch data from server once comment is submitted,
   * this will lead to update UI immediately once comment sent.
   */
  const handleCommentSumbit = () => {
      axios_fetch_photos_and_user();
      console.log("Submit was pressed, re-rendering photos and comments");
  };


  /**
   * Convert ISO format Date to a user friendly format
   * @returns string
   */
  const convertDate = isoDate => {
    const date = new Date(isoDate);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }
  
    // * Note: need to add "|| !user || !photos",
    // * so that after redirecting to another page, user and photos
    // * won't be accessed on another page,
    // * else it will cause unmount error in browser's console
    if (props.loginUser || !user || !photos) {
      // If there is user photo, then display user photos
      return ( photos && user && (
          <Grid container justifyContent="flex-start" spacing={3} >
            {/* Loop through all the photos */}
            {photos.map((photo) => (
              // Each photo's layout
              <Grid item xs={4} key={photo._id} >
                <Card style={{ border: "3px solid black" }} >
                  {/* Each photo's author name and author post time */}
                  <CardHeader
                    avatar={(
                      <Avatar style={{ backgroundColor: "#FF7F50", border: "1px solid black" }}>
                        {user.first_name[0]}
                      </Avatar>
                    )}
                    title={(
                      <Link to={`/users/${user._id}`}>
                        <Typography>{`${user.first_name} ${user.last_name}`}</Typography>
                      </Link>
                    )}
                    subheader={photo.date_time}
                  />

                  {/* Each photo's image */}
                  <CardMedia
                    component="img"
                    image={`./images/${photo.file_name}`}
                    alt="Anthor Post"
                  />

                  <CardActions>
                    <IconButton aria-label="like">
                      <ThumbUpOutlined />
                    </IconButton>
                  </CardActions>

                  {/* Comments' layout */}
                  <CardContent>
                    {/* Loop through all comments under the photo */}
                    {photo.comments && (
                      <Typography variant="subtitle1">
                        Comments:
                        <Divider/>
                      </Typography>
                    )}
                    {photo.comments.map((c) => (
                      <List key={c._id}>
                        <Typography variant="subtitle2">
                          <Link to={`/users/${c.user._id}`}>
                            {`${c.user.first_name} ${c.user.last_name}`}
                          </Link>
                        </Typography>
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          gutterBottom
                        >
                        {convertDate(c.date_time)}
                        </Typography>
                        <Typography variant="body1">
                          {`"${c.comment}"`}
                        </Typography>
                      </List>
                    ))}

                    {/* Comment dialog box */}
                    <CommentDialog
                      onCommentSumbit={handleCommentSumbit}
                      photo_id={photo._id}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )
      );
    } else {
      return <Redirect to={`/login-register`} />;
    }
}

export default UserPhotos;