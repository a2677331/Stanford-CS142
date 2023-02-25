import React from "react";
import { Button, Dialog, DialogContent, DialogContentText, TextField, DialogActions } from "@material-ui/core";
import "./commentDialog.css";


class CommentDialog extends React.Component {
    constructor(props) {
      super(props);
      this.state = { open: false };
    }
  
    handleClickOpen = () => this.setState({ open: true });
    handleClickClose = () => this.setState({ open: false });
  
    render() {
      return (
        <div className="comment-dialog">
          <Button variant="outlined" color="primary" size="small" onClick={this.handleClickOpen}>
            Reply
          </Button>
          <Dialog open={this.state.open} onClose={this.handleClickClose}>
            <DialogContent>
              <DialogContentText>Add a comment</DialogContentText>
              <TextField autoFocus multiline margin="dense" fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClickClose}>Cancel</Button>
              <Button onClick={this.handleClickClose}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  }

export default CommentDialog;