import React from "react";
import { Link } from "react-router-dom";
import { List, Divider, Typography, Grid, Avatar, Card, CardHeader, CardMedia, CardContent } from "@material-ui/core";
import "./userPhotos.css";
import { server } from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null,
      user: null
    };
  }

  // load photos and user detail when load or refreash
  componentDidMount() {
    if (this.props.match.params.userId) { // when there is an id, then get author's photos
      const photosUrl = `http://localhost:3000/photosOfUser/${this.props.match.params.userId}`;
      server.fetchModel(photosUrl).then(response => {
        this.setState({ photos: response.data });
      });
    }

    if (this.props.match.params.userId) { // when there is an id, then get author's info
      const userUrl = `http://localhost:3000/user/${this.props.match.params.userId}`;
      server.fetchModel(userUrl).then(response => {
        this.setState({ user: response.data });
        this.props.handler(response.data.first_name + ' ' + response.data.last_name);
      });
    }
  }

  render() {

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
    return this.state.photos ? (
      <Grid justifyContent="center" container spacing={3} >
        {this.state.photos.map((photo) => (
          <Grid item xs={6} key={photo._id}>
            <Card variant="outlined">
              <CardHeader
                title={linkToAuthor}
                subheader={photo.date_time}
                avatar={<Avatar style={{backgroundColor: '#FF7F50'}}>A</Avatar>}
              />
              <CardMedia
                component="img"
                image={`./images/${photo.file_name}`}
                alt="Anthor Post"
              />
              <CardContent>
                {photo.comments && (
                  <Typography variant="subtitle1">
                    Comments:
                    <Divider />
                  </Typography>
                )}
                {/* Only when photo has comments, then display related comments */}
                {photo.comments &&
                  photo.comments.map((c) => (
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    ) : (
      <div >Loading...</div>
    );
  }

}

export default UserPhotos;
