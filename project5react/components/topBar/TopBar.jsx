import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import './TopBar.css';
import { server } from "../../lib/fetchModelData";

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: null,
      user: null 
    };
  }

  /**
   * Show version number in TopBar, execute once first render is completed.
   */
  componentDidMount() {
    // load version number from server
    const infoUrl = "http://localhost:3000/test/info";
    server.fetchModel(infoUrl).then(response => { this.setState({ version: response.data.__v });});

    // if refreash current page, use current user id from route
    if (this.props.match.params.userId) { // only when there is id
      const userUrl = `http://localhost:3000/user/${this.props.match.params.userId}`;
      server.fetchModel(userUrl).then(response => { this.setState({ user: response.data });});
    }
  }

  /**
   * Show user name in TopBar, execute once route changes.
   * ! component is not re-rendering when the route changes, componentDidUpdate() can detect route changes.
   */
  componentDidUpdate(prevProps) {
    const prevUserID = prevProps.match.params.userId;
    const currUserID = this.props.match.params.userId;
    // update user'name if there is a different ID, and don't load if in homepage
    if (prevUserID !== currUserID && currUserID) {
        const UrlToLoad = `http://localhost:3000/user/${currUserID}`;
        server.fetchModel(UrlToLoad).then(response => { this.setState({ user: response.data });});
      }
  }


  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit" style={{flexGrow: 1}}>
            Fakebook
          </Typography>
          <Typography variant="h5" color="inherit" style={{flexGrow: 1}}>
            { `Ver: ${this.state.version}` }
          </Typography>
          <Typography variant="h5" color="inherit" >
            { this.props.match.path.includes("/photos/") && "Photos of " }
            {/* { this.state.user && `${this.state.user.first_name} ${this.state.user.last_name}` } */}
            { this.props.match.params.userId && this.state.user && `${this.state.user.first_name} ${this.state.user.last_name}` }
            {/* this.props.match.params.userId is null then is in homepage, don't show user name */}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
