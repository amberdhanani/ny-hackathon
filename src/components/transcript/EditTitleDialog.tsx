import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
  currentTitle: string;
  onSave: (newTitle: string) => void;
};

const EditTitleDialog = ({ open, onClose, currentTitle, onSave }: Props) => {
  const [title, setTitle] = useState(currentTitle);

  const handleSave = () => {
    onSave(title);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Title</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Transcript Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTitleDialog;
