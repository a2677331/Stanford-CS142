import React, { useState }  from "react";
import { Button, Dialog, DialogContent, DialogContentText, TextField, DialogActions, Chip } from "@material-ui/core";
import "./commentDialog.css";
import axios from "axios";


/**
 * * Jian Zhong
 * * CommentDialog, a React componment of CS142 project #7
 * * This component is for creating a comment dialog UI, 
 * * send newly added comment to server,
 * * notifiy upper level for the comment added,
 * * so that UserPohtos component will re-fetch data, and update UI.
 * @param props.handleSumbitChange: handle update notification.
 * @param props.photo_id: photo id that is being commmented.
 */
function CommentDialog(props) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  const handleClickOpen = () => setOpen(true);  // open comment dialog
  const handleClickClose = () => setOpen(false);// close comment dialog
  const handleCommentChange = event => setComment(event.target.value); // reflect comment whenever user chang it

  // Handle changes after Comment submitted
  const handleCommentSubmit = () => {
    const commentText = comment; // store the comment text
    setComment(""); // clear output before UI disppears
    setOpen(false); // close the comment dialog UI panel

    // Send to POST request with comment text in JSON format
    axios
      .post(`/commentsOfPhoto/${props.photo_id}`, { comment: commentText }) // send new comment to server
      .then(() => props.onCommentSumbit())                 // notify upper level component to re-render UI
      .catch(err => console.log("Comment Sent Failure: ", err));
  };

  // Rendering components
  return (
    <div className="comment-dialog">
      <Chip label="Reply" onClick={handleClickOpen} style={{ backgroundColor: "#abd1c6", border: "1px solid black" }} />
      {/* onClose: when mouse click outside of the dialog box, then close the dialog */}
      <Dialog open={open} onClose={handleClickClose} >
        <DialogContent>
          <DialogContentText>Add a comment...</DialogContentText>
          <TextField value={comment} onChange={handleCommentChange} autoFocus multiline margin="dense" fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose}>Cancel</Button>
          <Button onClick={handleCommentSubmit} style={{ backgroundColor: "#f9bc60", border: "1px solid black" }}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CommentDialog;