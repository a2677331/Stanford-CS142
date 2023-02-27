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
      })
      .catch(error => console.log( "/user/ Error: ", error));
  }


  /**
   * To re-fetch data from server once comment is submitted,
   * this will lead to update UI immediately once comment sent.
   */
  handleSumbitChange = () => {
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

    
  render() {
    // redirect to login page if not logged in
    if (!this.props.loginUser) {
      return <Redirect to={`/login-register`} />;
    }

    // If there is user, then render below component to link to user detail page
    let linkToAuthor; // Link component to Author
    if (this.state.user) {
      linkToAuthor = (
        <Link to={`/users/${this.state.user._id}`}>
          {`${this.state.user.first_name} ${this.state.user.last_name}`}
        </Link>
      );
    } else {
      linkToAuthor = <p>Loading...</p>;
    }

    // If there is user photo, then display user photos
    return (
      this.state.photos && (
        <Grid justifyContent="center" container spacing={3}>
          {/* Loop through all the photos */}
          {this.state.photos.map((photo) => (
            // Each photo's layout
            <Grid item xs={6} key={photo._id}>
              <Card variant="outlined">
                {/* Each photo's author name and author post time */}
                <CardHeader
                  title={linkToAuthor}
                  subheader={photo.date_time}
                  avatar={
                    <Avatar style={{ backgroundColor: "#FF7F50" }}>A</Avatar>
                  }
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
                    handleSumbitChange={this.handleSumbitChange}
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
