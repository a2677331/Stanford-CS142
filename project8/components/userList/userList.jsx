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
  const axios_fetchData = () => {
    axios
    .get("http://localhost:3000/user/list") // user list URL
    .then(response => { // Handle success
      setUser(response.data);
      console.log("** UserList: fetched User List **");
    })
    .catch(error => {   // Handle error
      console.log(`** Error: ${error.message} **\n`);
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else if (error.response) {
        // if status code from server is out of the range of 2xx.
        console.log("** Error: status code from server is out of the range of 2xx. **\n", error.response.status);
      } else if (error.request) {
        // if request was made and no response was received.
        console.log("** Error: request was made and no response was received. **\n", error.request);
      } else {
        // something happened in the setting up the request
        console.log("** Error: something happened in the setting up the request. **\n", error.message);
      }
    });
  };

  // to populate user list on side bar after an user logs in, and refresh page when logged
  useEffect(() => {
    if (props.loginUser) {
      axios_fetchData();
    }
  }, [props.loginUser]);

  // get the button clicked index on the user list
  const handleClick = index => {
    setSelectedButtonIndex(index); // update selected button index
  };

  // Rendering below
  let userList; // <Link> component

  // The user list only displays if the current user is logged in
  if (users && props.loginUser) {
    userList = users.map((usr, index) => (
      <React.Fragment key={index}>
        <ListItem
          to={`/users/${usr._id}`} 
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
            <ListItemText primary={<Typography variant="h6">{`${usr.first_name} ${usr.last_name}`}</Typography>} />
        </ListItem>
        <Divider />
      </React.Fragment>
    ));
  }
  return <List component="nav">{userList}</List>;

}

export default UserList;






// /**
//  * * Jian Zhong
//  * Define UserList, a React componment of CS142 project #5
//  * Generate a list of items from users' names,
//  * and link to user's detail when clicked
//  */
// class UserList extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       users: null,
//       selectedButtonIndex: null,
//     };
//   }
  
//   // Use Axios to send request and update the users state variable. 
//   axios_fetchData() {
//     axios
//       .get("http://localhost:3000/user/list") // user list URL
//       .then(response => { // Handle success
//         this.setState({ users: response.data });
//         console.log("** UserList: fetched User List **");
//       })
//       .catch(error => {     // Handle error
//         console.log(`** Error: ${error.message} **\n`);
//         if (axios.isCancel(error)) {
//           console.log('Request canceled', error.message);
//         } else if (error.response) {
//           // if status code from server is out of the range of 2xx.
//           console.log("** Error: status code from server is out of the range of 2xx. **\n", error.response.status);
//         } else if (error.request) {
//           // if request was made and no response was received.
//           console.log("** Error: request was made and no response was received. **\n", error.request);
//         } else {
//           // something happened in the setting up the request
//           console.log("** Error: something happened in the setting up the request. **\n", error.message);
//         }
//       });
//   }
  
//   // load user list when page first load or user refreash
//   componentDidMount() {
//     /**
//      * * Only show user lsit when login, 
//      * * otherwise don't fetch data.
//      */
//     if (this.props.loginUser) {
//       this.axios_fetchData();
//     }
//   }

//   // to populate user list on side bar after an user logs in
//   componentDidUpdate(prevProps) {
    
//     // Need to detect if user loggin status changes
//     if (this.props.loginUser !== prevProps.loginUser && this.props.loginUser) {
//       this.axios_fetchData();
//     }
//   }


//   handleClick = (index) => {
//     this.setState({ selectedButtonIndex: index }); // update selected button index
//   };

//   render() {
//     let userList; // <Link> component
  
//     // The user list only displays if the current user is logged in
//     if (this.state.users && this.props.loginUser) {
//       userList = this.state.users.map((user, index) => (
//         <React.Fragment key={index}  >
//           <ListItem
//             to={`/users/${user._id}`} 
//             component={Link} onClick={() => this.handleClick(index)}
//             button
//             style={{ backgroundColor: this.state.selectedButtonIndex === index ? "#004643" : "",
//              color: this.state.selectedButtonIndex === index ? "#ffff" : "" }}
//            >
//            {/* Selected style for button icons */}
//            {
//              this.state.selectedButtonIndex === index ?
//              <ListItemIcon><Person fontSize="large" style={{ color: "#ffff" }}/></ListItemIcon> :
//              <ListItemIcon><PersonOutlineOutlined fontSize="large" /></ListItemIcon>
//            }
//               <ListItemText primary={<Typography variant="h6">{`${user.first_name} ${user.last_name}`}</Typography>} />
//           </ListItem>
//           <Divider />
//         </React.Fragment>
//       ));
//     }
//     // style={{ paddingLeft: "8px" }}
//     return <List component="nav">{userList}</List>;
//   }
// }


// export default UserList;