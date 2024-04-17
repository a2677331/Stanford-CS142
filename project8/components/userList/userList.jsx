import React, { useState, useEffect }  from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText, ListItemIcon, Typography, Divider } from "@material-ui/core";
import "./userList.css";
import axios from "axios";
import {
  PersonOutlineOutlined,
  Person,
} from "@material-ui/icons";


/**
 * * Jian Zhong
 * Define UserList, a React componment of CS142 project #5
 * Generate a list of items from users' names,
 * and link to user's detail when clicked
 */
function UserList(props) {

  const [users, setUser] = useState(null);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

  // Use Axios to send request and update the users state variable. 
  const axios_fetchUser = () => {
    axios
      .get("http://localhost:3000/user/list") // user list URL
      .then(response => { // Handle success
        console.log("** UserList: fetched User List **");
        setUser(response.data);
      })
      .catch(error => {   // Handle error
        console.log(`** UserList Error: ${error.message} **`);
      });
  };

  // to populate user list on side bar after an user logs in, and refresh page when logged
  useEffect(() => {
    axios_fetchUser();
  }, [props.loginUser]);

  // get the button clicked index on the user list
  const handleClick = index => setSelectedButtonIndex(index); // update selected button index

  // Rendering below
  let userList; // <Link> component

  // The user list only displays if the user is logged in
  if (users && props.loginUser) {
    userList = users.map((user, index) => (
      <React.Fragment key={index}>
        <ListItem
          to={`/users/${user._id}`} 
          component={Link} onClick={() => handleClick(index)}
          button
          style={{ backgroundColor: selectedButtonIndex === index ? "#004643" : "",
            color: selectedButtonIndex === index ? "#ffff" : "" }}
          >
          {/* Selected style for button icons */}
          {
            selectedButtonIndex === index ?
            <ListItemIcon><Person fontSize="large" style={{ color: "#ffff" }}/></ListItemIcon> :
            <ListItemIcon><PersonOutlineOutlined fontSize="large" /></ListItemIcon>
          }
            <ListItemText primary={
              <Typography variant="h6">{user.first_name +  " " + user.last_name + (props.loginUser.id === user._id ? " (Me)" : "")}</Typography>
            } />
        </ListItem>
        <Divider />
      </React.Fragment>
    ));
  }


  return <List component="nav">{userList}</List>;
}

export default UserList;