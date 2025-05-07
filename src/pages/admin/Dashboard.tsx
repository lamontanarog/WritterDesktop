// Dashboard.tsx - Panel de administración de ideas

import { useState } from 'react';
import {
  Box, Button, Card, CardContent, Container, Grid, Typography, TextField, IconButton, CircularProgress
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useGetIdeasQuery, useCreateIdeaMutation, useUpdateIdeaMutation, useDeleteIdeaMutation } from '../../features/api/apiSlice';
import ProtectedRoute from '../../components/ProtectedRoute';
import LogoutButton from '../../components/LogoutButton';
import IdeaFormDialog from './IdeaFormDialog';
import { Idea } from '../../types/idea';
import { toast } from 'sonner';

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  const { data: ideasData, isLoading, refetch } = useGetIdeasQuery({ page, search });
  const [createIdea] = useCreateIdeaMutation();
  const [updateIdea] = useUpdateIdeaMutation();
  const [deleteIdea] = useDeleteIdeaMutation();

  const handleOpenDialog = (idea: Idea | null = null) => {
    setSelectedIdea(idea);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedIdea(null);
  };

  const handleSaveIdea = async (data: { title: string; content: string }) => {
    try {
      if (selectedIdea) {
        await updateIdea({ id: selectedIdea.id, data }).unwrap();
        toast.success('Idea actualizada correctamente');
      } else {
        await createIdea(data).unwrap();
        toast.success('Idea creada correctamente');
      }
      handleCloseDialog();
      refetch();
    } catch (error) {
      toast.error('Error al guardar la idea');
      console.error('Save error:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIdea(id).unwrap();
      toast.success('Idea eliminada correctamente');
      refetch();
    } catch (error) {
      toast.error('Error al eliminar idea');
      console.error('Delete error:', error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Encabezado */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4">Panel de Ideas</Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" onClick={() => handleOpenDialog()}>Nueva Idea</Button>
            <LogoutButton />
          </Box>
        </Box>

        {/* Buscador */}
        <TextField
          fullWidth
          label="Buscar ideas"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
        />

        {/* Lista de Ideas */}
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {ideasData?.data?.map((idea) => (
              <Grid item xs={12} sm={6} md={4} key={idea.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">{idea.title}</Typography>
                      <Box>
                        <IconButton onClick={() => handleOpenDialog(idea)}><Edit /></IconButton>
                        <IconButton onClick={() => handleDelete(idea.id)}><Delete /></IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">{idea.content}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <IdeaFormDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveIdea}
          defaultValues={selectedIdea}
        />
      </Container>
    </ProtectedRoute>
  );
};

export default Dashboard;
