import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { TextField } from '@material-ui/core';

export default function FormDialog({open,handleClose,data,onChange,handleFormSubmit}) {
 const {taskName,description}=data

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">taskName</DialogTitle>
        <DialogContent>
         <form>
             <TextField id="taskName" value={taskName} onChange={e=>onChange(e)} placeholder="Please Enter Task Title" label="Task Title" variant="outlined" margin="dense" fullWidth />
             <TextField id="description" value={description} onChange={e=>onChange(e)} placeholder="Please Enter the what you worked on" label="Work Description" variant="outlined" margin="dense" fullWidth />
             {/* <TextField id="week-first-day" value={phone} onChange={e=>onChange(e)} placeholder="Enter how many hours you work on this task" label="Phone Number" variant="outlined" margin="dense" fullWidth />
             <TextField id="dob" value={dob} onChange={e=>onChange(e)} placeholder="Enter Date of birth" label="Date of Birth" variant="outlined" margin="dense" fullWidth /> */}
         </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button  color="primary" onClick={()=>handleFormSubmit()} variant="contained">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
