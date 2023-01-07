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
    };
  }

  /**
   * Show version number in TopBar, execute once first render is completed.
   */
  componentDidMount() {
    // load version number from server
    const infoUrl = "http://localhost:3000/test/info";
    server.fetchModel(infoUrl).then(response => { 
      this.setState({ version: response.data.__v });
    });
  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" style={{flexGrow: 1}}>
            Fakebook
          </Typography>
          <Typography variant="h5" style={{flexGrow: 1}}>
            Ver: {this.state.version}
          </Typography>
          <Typography variant="h5">
            { this.props.match.path.includes("/photos/") && "Photos of " }
            { this.props.match.path.includes("/users/") && "Info of " }
            { this.props.match.params.userId && `${this.props.userName}` }
            {/* If "this.props.match.params.userId" is null then is in homepage, don't show user name */}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
