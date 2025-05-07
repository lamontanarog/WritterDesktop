// IdeaFormDialog.tsx - Diálogo reutilizable para crear o editar una idea

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Idea } from "../../types/idea";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: { title: string; content: string }) => void;
  defaultValues?: Idea | null;
}

const IdeaFormDialog = ({ open, onClose, onSave, defaultValues }: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (defaultValues) {
      setTitle(defaultValues.title);
      setContent(defaultValues.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [defaultValues, open]);

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSave({ title, content });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          color: "text.primary",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ color: "text.primary" }}>
        {defaultValues ? "Editar Idea" : "Nueva Idea"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Título"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            mb: 2,
            input: { color: "text.primary" },
            label: { color: "text.secondary" },
          }}
        />
        <TextField
          margin="dense"
          label="Contenido"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            input: { color: "text.primary" },
            label: { color: "text.secondary" },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {defaultValues ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdeaFormDialog;
