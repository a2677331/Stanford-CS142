import React from "react";
import { Link, Redirect } from "react-router-dom";
import { List, Divider, Typography, Grid, Avatar, Card, CardHeader, CardMedia, CardContent } from "@material-ui/core";
import "./userPhotos.css";
import axios from "axios";
import CommentDialog from "../commentDialog/commentDialog";

/**
 * * Jian Zhong
 * Define UserPhotos, a React componment of CS142 project #5
 */
export default class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null, // photos list where each photo contains comments list
      user: null,   // Author who posts the photo
    };
  }

  /**
   * user axios to get photos data and photo's Author data
   * from user ID
   *  */
  axios_fetch_photos_and_user() {
    // To get photo data
    axios 
    .get(`/photosOfUser/${this.props.match.params.userId}`) // photo url
    .then(response => this.setState({ photos: response.data }))
    .catch(error => console.log( "/photosOfUser/ Error: ", error));

    // To get photo's Author data
    axios
      .get(`/user/${this.props.match.params.userId}`)  // user url
      .then(response => { 
        this.setState({ user: response.data });
        this.props.onUserNameChange(response.data.first_name + ' ' + response.data.last_name);
        console.log("** UserPhotos: fetched User Photos **");
      })
      .catch(error => console.log( "/user/ Error: ", error));
  }


  /**
   * To re-fetch data from server once comment is submitted,
   * this will lead to update UI immediately once comment sent.
   */
  handleCommentSumbit = () => {
    console.log("Submit was pressed, re-rendering photos and comments");
    this.axios_fetch_photos_and_user();
  };

  /**
   * To fetch photos and author data when click the "See Photo" button.
   *  */ 
  componentDidMount() {
    // when there is an id after "/photos/<user_id>"
    if (this.props.match.params.userId) { 
      this.axios_fetch_photos_and_user();
    }
  }

  /**
   * To detect if a new photo is added, re-render if it was.
   * @param this.props.photoIsUploaded: if a new photo was updated
   */
  componentDidUpdate(prevProps) {
    if (prevProps.photoIsUploaded!==this.props.photoIsUploaded && this.props.photoIsUploaded) {
        console.log("Trigger re-render");
        this.axios_fetch_photos_and_user();
      }
  }

    
  render() {
    // If not yet login, redirect to login page
    if (!this.props.loginUser) {
      return <Redirect to={`/login-register`} />;
    }

    // If there is no user, then render below:
    if (!this.state.user) {
      return <p>Loading</p>;
    }

    // If there is user photo, then display user photos
    return (
      this.state.photos && (
        <Grid justifyContent="flex-start" container spacing={3}>
          {/* Loop through all the photos */}
          {this.state.photos.map((photo) => (

            // Each photo's layout
            <Grid item xs={6} key={photo._id}>
              <Card variant="outlined">
                {/* Each photo's author name and author post time */}
                <CardHeader
                  avatar={(
                    <Avatar style={{ backgroundColor: "#FF7F50" }}>
                      {this.state.user.first_name[0]}
                    </Avatar>
                  )}                
                  title={(
                    <Link to={`/users/${this.state.user._id}`}>
                      {`${this.state.user.first_name} ${this.state.user.last_name}`}
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

                {/* Comments' layout */}
                <CardContent>
                  {/* Loop through all comments under the photo */}
                  {photo.comments && (
                    <Typography variant="subtitle1">
                      Comments:
                      <Divider />
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
                        {c.date_time}
                      </Typography>
                      <Typography variant="body1">
                        {`"${c.comment}"`}
                      </Typography>
                    </List>
                  ))}

                  {/* Comment dialog box */}
                  <CommentDialog
                    onCommentSumbit={this.handleCommentSumbit}
                    photo_id={photo._id}
                  />
                </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>
      )
    );
  }

}
