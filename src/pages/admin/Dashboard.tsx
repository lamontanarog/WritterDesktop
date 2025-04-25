import { useState } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { useGetIdeasQuery, useCreateIdeaMutation, useUpdateIdeaMutation, useDeleteIdeaMutation } from '../../features/api/apiSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ProtectedRoute from '../../components/ProtectedRoute';
import { Idea } from '../../types/idea';
import LogoutButton from '../../components/LogoutButton';

const Dashboard = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
    const [formData, setFormData] = useState({ title: '', content: '' });

    const { data: ideasData, isLoading, refetch } = useGetIdeasQuery({ page, search });
    const [createIdea] = useCreateIdeaMutation();
    const [updateIdea] = useUpdateIdeaMutation();
    const [deleteIdea] = useDeleteIdeaMutation();

    const handleOpenDialog = (idea: Idea | null = null) => {
        if (idea) {
            setEditingIdea(idea);
            setFormData({ title: idea.title, content: idea.content });
        } else {
            setEditingIdea(null);
            setFormData({ title: '', content: '' });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingIdea(null);
        setFormData({ title: '', content: '' });
    };

    const handleSubmit = async () => {
        try {
            if (editingIdea) {
                await updateIdea({ id: editingIdea.id, data: { title: formData.title, content: formData.content } }).unwrap();
            } else {
                await createIdea(formData).unwrap();
            }
            handleCloseDialog();
            refetch()
        } catch (error) {
            console.error('Error saving idea:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteIdea(id).unwrap();
        } catch (error) {
            console.error('Error deleting idea:', error);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['ADMIN']}>
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        Admin Dashboard
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                        Nueva Idea
                    </Button>
                    <LogoutButton/>
                </Box>

                <TextField
                    fullWidth
                    label="Buscar ideas"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 4 }}
                />

                {isLoading ? (
                    <Typography>Cargando...</Typography>
                ) : (
                    <Grid container spacing={3}>
                        {ideasData?.data?.map((idea: Idea) => (
                            <Grid item xs={12} sm={6} md={4} key={idea.id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="h6" component="div">
                                                {idea.title}
                                            </Typography>
                                            <Box>
                                                <IconButton onClick={() => handleOpenDialog(idea)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(idea.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {idea.content}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>
                        {editingIdea ? 'Editar Idea' : 'Nueva Idea'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Título"
                            type="text"
                            fullWidth
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="dense"
                            label="Contenido"
                            type="text"
                            fullWidth
                            multiline
                            rows={4}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button onClick={handleSubmit} variant="contained">
                            {editingIdea ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </ProtectedRoute>
    );
};

export default Dashboard; 