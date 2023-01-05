import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, Divider } from "@material-ui/core";
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
    if (this.props.match.params.userId) { // only when there is id
      const photosUrl = `http://localhost:3000/photosOfUser/${this.props.match.params.userId}`;
      server.fetchModel(photosUrl).then(response => { 
        this.setState({ photos: response.data });
      });
    }

    if (this.props.match.params.userId) { // only when there is id
      const userUrl = `http://localhost:3000/user/${this.props.match.params.userId}`;
      server.fetchModel(userUrl).then(response => { 
        this.setState({ user: response.data });
      });
    }
  }

  render() {
    // Create a link only after user is loaded.
    let linkToAuthor; // Link component to Author
    if (this.state.user) {
      linkToAuthor = <Link to={ `/users/${this.state.user._id}` }>{ `${this.state.user.first_name} ${this.state.user.last_name}` }</Link>;
    } else {
      linkToAuthor = <p>Loading...</p>;
    }

    return (
      <div>
      { this.state.photos && this.state.photos.map(photo => (
            <List key={photo._id} >
              <ListItem className="cs142-main-photo-author" >
                Anthor: &nbsp;{linkToAuthor}&nbsp;·&nbsp;{ photo.date_time }
              </ListItem>
              <ListItem>
                <img src={ `./images/${photo.file_name}` } alt=""/>
              </ListItem>
              {/* Only when photo has comments, then need to show comments */}
              { photo.comments && photo.comments.map(c => (
                <List key={c._id} component="ul"> 
                  <ListItem className="cs142-main-photo-comments" >
                    Comment by&nbsp;
                    <Link to={ `/users/${c.user._id}`}>{ `${c.user.first_name} ${c.user.last_name}` }</Link>
                    &nbsp;{ `· ${c.date_time}` }
                  </ListItem>
                  <ListItem className="cs142-main-comments" >
                    <ListItemText inset secondary={ `"${c.comment}"` } />
                  </ListItem>
                </List>
                ))}
                <Divider/>
            </List>
        ))}
      </div>
    );
  }
}

export default UserPhotos;
