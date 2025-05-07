// Home.tsx - Página principal con selección de ideas

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetIdeasQuery } from "../features/api/apiSlice";
import {
  Box, Button, Container, Typography, Grid, Divider, Chip, CircularProgress, Paper, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Create as CreateIcon, FormatQuote as FormatQuoteIcon, AccountCircle, Edit } from "@mui/icons-material";
import { Idea } from "../types/idea";
import Randomizer from "../components/Randomizer";
import LogoutButton from "../components/LogoutButton";
import IdeaCard from "../components/IdeaCard";

const Home = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    data: ideasData,
    isLoading,
    isError,
    refetch,
  } = useGetIdeasQuery({ page, limit: 10 }, { skip: !localStorage.getItem("token") });

  const handleSelectIdea = (idea: Idea) => {
    navigate("/write", { state: { ideaId: idea.id } });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetch();
  };

  if (isLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
  }

  if (isError) {
    return <Paper sx={{ p: 4, textAlign: "center", bgcolor: "error.light" }}><Typography color="error">Error al cargar ideas.</Typography></Paper>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button onClick={() => navigate("/profile")} variant="contained" startIcon={<AccountCircle />}>Mi Perfil</Button>
        <LogoutButton />
      </Box>

      <Paper elevation={2} sx={{ textAlign: "center", mb: 6, p: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          <CreateIcon sx={{ mr: 2 }} /> Writing Inspiration
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
          Choose an idea to spark your creativity or generate a random prompt to begin your writing journey
        </Typography>
        <Box display="flex" justifyContent="center">
          <Randomizer setSelectedIdea={(idea) => handleSelectIdea(idea)} />
        </Box>
      </Paper>

      <Divider sx={{ mb: 6 }}>
        <Chip icon={<FormatQuoteIcon />} label="Writing Prompts" color="primary" />
      </Divider>

      <Grid container spacing={3}>
        {ideasData?.data?.map((idea) => (
          <Grid item xs={12} sm={6} md={4} key={idea.id}>
            <IdeaCard
              idea={idea}
              onWrite={() => handleSelectIdea(idea)}
              onPreview={() => {
                setSelectedIdea(idea);
                setDialogOpen(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {ideasData?.data?.length === 0 && (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No hay ideas disponibles.
          </Typography>
        </Paper>
      )}

      {/* Paginación */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={4} gap={2}>
        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Anterior</Button>
        <Chip label={`Página ${page}`} color="primary" variant="outlined" />
        <Button onClick={() => handlePageChange(page + 1)} disabled={!ideasData?.data || ideasData.data.length < 10}>Siguiente</Button>
      </Box>

      {/* Modal Vista Previa */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedIdea?.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {selectedIdea?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
          <Button onClick={() => selectedIdea && handleSelectIdea(selectedIdea)} startIcon={<Edit />} variant="contained">Escribir</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home;
