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

  
  componentDidMount() {
    // load user list when page first load or user refreash
    const url = "http://localhost:3000/user/list"; 

    axios // Use Axios to send request and update the users state variable. 
      .get(url) // returning a promise
      .then((response) => { // Handle success
        console.log("** Succes: fetched data from " + url +" **");
        this.setState({ users: response.data });
      })
      .catch(error => {     // Handle error
        console.error(`** Error: ${error.message} **\n`);
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