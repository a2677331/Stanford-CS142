import * as React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText } from "@material-ui/core";
import "./userList.css";
import { server } from "../../lib/fetchModelData";

/**
 * Define UserList, a React componment of CS142 project #5
 * Generate a list of items from users' names,
 * and link to user's detail when clicked
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
    };
  }

  // load user list when page first load or user refreash
  componentDidMount() {
      const usersUrl = "http://localhost:3000/user/list";
      server.fetchModel(usersUrl).then(response => { 
        this.setState({ users: response.data });
      });
  }

  render() {
    // Create a link only after user is loaded, or show loading prompt.
    let userList; // Link component
    if (this.state.users) {
      userList = (
        this.state.users.map((user) => (
          <ListItem to={`/users/${user._id}`} component={Link} key={user._id} divider button >
            {/* Link's to must be direct link address */}
            <ListItemText primary={user.first_name + " " + user.last_name} />
          </ListItem>
        )));
    } else {
      userList = <ListItem>Loading...</ListItem>;
    }

    return (
      <List component="nav">
        { userList }
      </List>
    );
  }

}

export default UserList;