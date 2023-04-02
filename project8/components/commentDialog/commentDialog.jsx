import React from "react";
import { Button, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Chip } from "@material-ui/core";
import "./commentDialog.css";
import axios from "axios";

/**
 * * Jian Zhong
 * CommentDialog, a React componment of CS142 project #7
 * This component is for creating a comment dialog UI, 
 * send newly added comment to server,
 * notifiy upper level for the comment added,
 * so that UserPohtos component will re-fetch data, and update UI.
 * @param this.props.handleSumbitChange: handle update notification.
 * @param this.props.photo_id: photo id that is being commmented.
 */
export default class CommentDialog extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        open: false,
        comment: "",
      };
    }

    handleClickOpen = () => this.setState({ open: true });  // open comment dialog
    handleClickClose = () => this.setState({ open: false });// close comment dialog
    handleCommentChange = e => this.setState({ comment: e.target.value }); // reflect comment whenever user chang it

    // Handle changes after Comment submitted
    handleCommentSubmit = () => {
      const commentText = this.state.comment; // store the comment text
      this.setState({ comment: "" }); // clear output before UI disppears
      this.setState({ open: false }); // close the comment dialog UI panel

      // Send to POST request with comment text in JSON format
      axios
        .post(`/commentsOfPhoto/${this.props.photo_id}`, { comment: commentText }) // send new comment to server
        .then(() => this.props.onCommentSumbit())                 // notify upper level component to re-render UI
        .catch(error => console.log("Comment Sent Failure: ", error));
    };
  
    render() {
      return (
        <div className="comment-dialog">
          <Chip label="Reply" onClick={this.handleClickOpen} style={{ backgroundColor: "#abd1c6", border: "1px solid black" }} />
          {/* onClose: when mouse click outside of the dialog box, then close the dialog */}
          <Dialog open={this.state.open} onClose={this.handleClickClose} >
            <DialogContent>
              <DialogContentText>Add a comment...</DialogContentText>
              <TextField value={this.state.comment} onChange={this.handleCommentChange} autoFocus multiline margin="dense" fullWidth />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClickClose}>Cancel</Button>
              <Button onClick={this.handleCommentSubmit} style={{ backgroundColor: "#f9bc60", border: "1px solid black" }}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  }