import * as React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText } from "@material-ui/core";
import "./userList.css";
import axios from "axios";

/**
 * * Jian Zhong
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
    const url = "http://localhost:3000/user/list";

    // Use Axios to send request and update the users state variable.
    axios.get(url)
      .then((response) => {
        // Handle success
        console.log("** Succes: fetched data from " + url +" **");
        this.setState({ users: response.data });
      })
      .catch((error) => {
        // Handle error
        if (error.response) {
          // if status code from server is out of the range of 2xx.
          console.log(
            "** Error: status code from server is out of the range of 2xx. **\n",
            error.response.status
          );
        } else if (error.request) {
          // if request was made and no response was received.
          console.log(
            "** Error: request was made and no response was received. **\n",
            error.request
          );
        } else {
          // something happened in the setting up the request
          console.log(
            "** Error: something happened in the setting up the request. **\n",
            error.message
          );
        }
      });

  }

  render() {
    let userList; // <Link> component

    // if user list exists, display the first name and last name.
    if (this.state.users) {
      userList = this.state.users.map((user) => (
        <ListItem
          to={`/users/${user._id}`}
          component={Link}
          key={user._id}
          divider
          button
        >
          {/* Link's to must be direct link address */}
          <ListItemText primary={user.first_name + " " + user.last_name} />
        </ListItem>
      ));
    } else {
      // User list does not exist, display message.
      userList = (
        <ListItem>Loading User List on &quot;userList.jsx&quot;</ListItem>
      );
    }

    return <List component="nav">{userList}</List>;
  }
}

export default UserList;