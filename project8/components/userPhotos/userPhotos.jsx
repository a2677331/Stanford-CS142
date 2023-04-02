import React from "react";
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
import {
  ThumbUpOutlined,
} from "@material-ui/icons";
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
      user: null, // Author who posts the photo
    };
  }

  /**
   * user axios to get photos data and photo's Author data
   * from user ID
   *  */
  axios_fetch_photos_and_user() {
    // To get photo's Author data
    axios
      .get(`/user/${this.props.match.params.userId}`) // user url
      .then((response) => {
        this.setState({ user: response.data });
        this.props.onUserNameChange(
          response.data.first_name + " " + response.data.last_name
        ); // handle TopBar user name change
        this.props.onLoginUserChange({
          // handle page refresh
          first_name: response.data.logged_user_first_name, // to know who is current logged user after refresh
        });
        console.log("** UserPhotos: fetched User Photos **");
      })
      .catch((error) => console.log("/user/ Error: ", error));

    // To get photo data
    axios
      .get(`/photosOfUser/${this.props.match.params.userId}`) // photo url
      .then((response) => this.setState({ photos: response.data }))
      .catch((error) => console.log("/photosOfUser/ Error: ", error));
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
    this.axios_fetch_photos_and_user();
  }

  /**
   * To detect if a new photo is added, re-render if it was.
   * @param this.props.photoIsUploaded: if a new photo was updated
   */
  componentDidUpdate(prevProps) {
    if (
      prevProps.photoIsUploaded !== this.props.photoIsUploaded &&
      this.props.photoIsUploaded
    ) {
      console.log("Trigger re-render");
      this.axios_fetch_photos_and_user();
    }
  }

  /**
   * Convert ISO format Date to a user friendly format
   * @returns string
   */
  static convertDate(isoDate) {
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

  render() {
    // * Note: need to add "|| !this.state.user || !this.state.photos",
    // * so that after redirecting to another page, this.state.user and this.state.photos
    // * won't be accessed on another page,
    // * else it will cause unmount error in browser's console
    if (this.props.loginUser || !this.state.user || !this.state.photos) {
      // If there is user photo, then display user photos
      return (
        this.state.photos &&
        this.state.user && (
          <Grid container justifyContent="flex-start" spacing={3} >
            {/* Loop through all the photos */}
            {this.state.photos.map((photo) => (
              // Each photo's layout
              <Grid item xs={4} key={photo._id} >
                <Card style={{ border: "3px solid black" }} >
                  {/* Each photo's author name and author post time */}
                  <CardHeader
                    avatar={(
                      <Avatar style={{ backgroundColor: "#FF7F50", border: "1px solid black" }}>
                        {this.state.user.first_name[0]}
                      </Avatar>
                    )}
                    title={(
                      <Link to={`/users/${this.state.user._id}`}>
                        <Typography>{`${this.state.user.first_name} ${this.state.user.last_name}`}</Typography>
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
                        {UserPhotos.convertDate(c.date_time)}
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
    } else {
      return <Redirect to={`/login-register`} />;
    }
  }
}
