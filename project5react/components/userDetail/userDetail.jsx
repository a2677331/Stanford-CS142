import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText} from "@material-ui/core";
import "./userDetail.css";
import { server } from "../../lib/fetchModelData";


/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  // load data when page first load or refreash
  componentDidMount() {
    if (this.props.match.params.userId) { // only when there is id
      const userUrl = `http://localhost:3000/user/${this.props.match.params.userId}`;
      server.fetchModel(userUrl).then(response => { 
        this.setState({ user: response.data });
      });
    }
  }

  // load data user click on different user list and show the user's detail
  componentDidUpdate(prevProps) {
    const prevUserID = prevProps.match.params.userId;
    const currUserID = this.props.match.params.userId;
    if (prevUserID !== currUserID && currUserID) {
      const UrlToLoad = `http://localhost:3000/user/${currUserID}`;
      server.fetchModel(UrlToLoad).then(response => { 
        this.setState({ user: response.data });
      });
    }
  }

  render() {
    let linkToUserPhotos; // Link component
    
    // Create a link only after user is loaded, or show loading prompt.
    if (this.state.user) {
      linkToUserPhotos = (
        <ListItem to={ this.state.user && `/photos/${this.state.user._id}` } component={Link} >
          <ListItemText primary={"See User Photos"} /> {/* Link's to must be direct link address */}
        </ListItem>
        );
    } else {
      linkToUserPhotos = <ListItem>Loading...</ListItem>;
    }


    return (
      <List component="ul" disablePadding>
        <ListItem>
          <ListItemText primary={ this.state.user && `Name: ${this.state.user.first_name} ${this.state.user.last_name}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary={ this.state.user && `Description: ${this.state.user.description}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary={ this.state.user && `Location: ${this.state.user.location}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary={ this.state.user && `Occupation: ${this.state.user.occupation}`} />
        </ListItem>
        { linkToUserPhotos }
      </List>
    );
  }
}

export default UserDetail;
