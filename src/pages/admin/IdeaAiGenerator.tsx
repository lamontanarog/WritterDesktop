import { useState } from "react";
import { Box, Button, Paper, TextField, Typography, CircularProgress } from "@mui/material";
import { useCreateIdeaMutation } from "../../features/api/apiSlice";
import { generateIdeaWithOpenRouter } from "../../hooks/generateIdeaWithOpenRouter";

const IdeaAIGenerator = () => {
  const [category, setCategory] = useState("");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [createIdea] = useCreateIdeaMutation();

  const handleGenerate = async () => {
    setLoading(true);
    setIdea("");
    try {
      const generated = await generateIdeaWithOpenRouter(category);
      setIdea(generated || "No se pudo generar una idea.");
    } catch (err) {
      console.error(err);
      setIdea("Error al generar idea.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await createIdea({ title: category, content: idea }).unwrap();
      setCategory("");
      setIdea("");
    } catch (err) {
      console.error("Error al guardar idea:", err);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" gutterBottom>Generar idea con IA (OpenRouter)</Typography>
      <TextField
        label="Categoría o palabra clave"
        fullWidth
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleGenerate} disabled={!category || loading}>
        {loading ? <CircularProgress size={20} /> : "Generar"}
      </Button>

      {idea && (
        <Box mt={3}>
          <Typography variant="body1" sx={{ mb: 1 }}>Idea generada:</Typography>
          <Paper sx={{ p: 2, mb: 2 }}>{idea}</Paper>
          <Button variant="outlined" onClick={handleSave} color="success">
            Guardar como nueva idea
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default IdeaAIGenerator;
