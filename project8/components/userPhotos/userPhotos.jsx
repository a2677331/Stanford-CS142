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
  Button,
} from "@material-ui/core";
import { ThumbUp, ThumbUpOutlined } from "@material-ui/icons";
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
   * use axios to get photo's Author data
   * from user ID
   */
  const axios_fetch_user = userID => {
    // To get photos' Author data
    axios.get(`/user/${userID}`) // user url
        .then(response => {
            setUser(response.data);
            props.onUserNameChange(response.data.first_name + " " + response.data.last_name); // handle TopBar user name change
            props.onLoginUserChange({ first_name: response.data.logged_user_first_name, 
                                       last_name: response.data.logged_user_last_name,
                                              id: response.data.logged_user_id  }); // handle page refresh, to know who is current logged user after refresh
        })
        .catch(err => console.log("/user/ Error: ", err));
  };

  /**
   * use axios to get photos data from user ID
   */
  const axios_fetch_photos = userID => {
    // To get user's photos
    axios.get(`/photosOfUser/${userID}`) // photo url
        .then(response => setPhotos(response.data))
        .catch(err => console.log("/photosOfUser/ Error: ", err));
  };

  /**
   * Update user photos and user data when clickinhg the "See Photo" button under an author.
   * If a new photo is added, re-render will add new uploaded photos.
   * @param props.photoIsUploaded: if a new photo was updated
   */
  useEffect(() => { 
    axios_fetch_user(props.match.params.userId);
    axios_fetch_photos(props.match.params.userId);
  }, [props.photoIsUploaded, props.match.params.userId]);

  /**
   * To re-fetch data from server once comment is submitted,
   * this will lead to update UI immediately once comment sent.
   */
  const handleCommentSumbit = () => {
      axios_fetch_user(props.match.params.userId);
      axios_fetch_photos(props.match.params.userId);
      console.log("Submit was pressed, re-rendering photos and comments");
  };

  const handleLikeClick = photo_id => {
    // reflect user's like action to the server
    axios.post(`/updatePhotoLikes/${photo_id}`, {action: props.loginUser.id}) // send new like action to server
         .then(() => {
           // use axios to get user's photos, therefore updating like buttons for all photos.
           axios_fetch_photos(props.match.params.userId);
         })
         .catch(err => console.log("Like Update Failure: ", err));
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
  };

   /**
   * See if a photo is liked by login user
   * @returns boolean
   */ 
  const likedByLoginUser = photo => {
    for (let i = 0; i < photo.likes.length; i++) {
      if (photo.likes[i]._id === props.loginUser.id) return true;
    }
    return false;
  };

    /**
   * To constrcut a full name from photo.likes list
   * @returns list of strings
   */ 
  const likesNameList = photo => {
    const nameList = photo.likes.map( like => {
      let name = like.first_name + " " + like.last_name;
      return name;
    });
    return nameList;
  };
  
    // * Note: need to add "|| !user || !photos",
    // * so that after redirecting to another page, user and photos
    // * won't be accessed on another page,
    // * else it will cause unmount error in browser's console
    if (props.loginUser || !user || !photos) {
      // If there is user photo, then display user photos
      return ( photos && user && (
          <Grid container justifyContent="flex-start" spacing={3} >
            {/* Loop through all the photos */}
            {photos.map(photo => (
              // Each photo's layout
              <Grid item xs={4} key={photo._id} >
                <Card style={{ border: "1px solid black" }} >
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

                  {/* Like button */}
                  <Typography variant="button" style={{ marginLeft: "6px", textTransform: "none"}}>
                    {photo.likes.length > 0 ?
                    `Liked by ${likesNameList(photo).map(name => name).join(", ")}` : ``}
                  </Typography>
                  <Divider/>
                  <CardActions style={{ paddingBottom: "0" }} >
                    <Button onClick={() => handleLikeClick(photo._id)} style={{ margin: "0 auto" }}>
                      {likedByLoginUser(photo) ? 
                      <ThumbUp color="secondary" /> : <ThumbUpOutlined color="action" />}
                      <Typography variant="button" style={{ marginLeft: "5px"}} >
                        {photo.likes.length}
                      </Typography>
                    </Button>
                  </CardActions>

                  {/* Comments' layout */}
                  <CardContent style={{ paddingTop: "0" }}>
                    {/* Loop through all comments under the photo */}
                    {photo.comments && (
                      <Typography variant="subtitle1">
                        Comments:
                        <Divider/>
                      </Typography>
                    )}
                    {photo.comments.map(c => (
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

