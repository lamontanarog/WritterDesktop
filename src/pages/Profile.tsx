import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  ArrowBack,
  AccessTime as AccessTimeIcon,
  TextFields as TextFieldsIcon,
} from "@mui/icons-material";
import { toast } from "sonner";

import {
  useGetCurrentUserQuery,
  useGetTextsQuery,
  useDeleteTextMutation,
  useUpdateTextMutation,
  useGetIdeasQuery,
} from "../features/api/apiSlice";
import LogoutButton from "../components/LogoutButton";
import TextItem from "../components/TextItem";
import { Text } from "../types/text";
import { Idea } from "../types/idea";

const Profile = () => {
  const navigate = useNavigate();
  const [selectedText, setSelectedText] = useState<Text | null>(null);
  const [editContent, setEditContent] = useState("");
  const [page, setPage] = useState(1);

  // Diálogos
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  // Fetch de usuario y textos
  const {
    data: user,
    isLoading: isLoadingUser,
    isError: isUserError,
  } = useGetCurrentUserQuery(undefined, {
    skip: !localStorage.getItem("token"),
  });
  const {
    data: textsResponse,
    isLoading: isLoadingTexts,
    isError: isTextsError,
    refetch,
  } = useGetTextsQuery(
    { page, limit: 10 },
    { skip: !localStorage.getItem("token") }
  );
  const texts = textsResponse?.data || [];

  // Fetch de ideas
  const { data: ideasResponse } = useGetIdeasQuery(
    { page: 1, limit: 100 },
    { skip: texts.length === 0 }
  );

  const ideasMap = useMemo(() => {
    return (
      ideasResponse?.data.reduce((acc, idea) => {
        acc[idea.id] = idea;
        return acc;
      }, {} as Record<number, Idea>) || {}
    );
  }, [ideasResponse]);

  const [deleteText, { isLoading: isDeleting }] = useDeleteTextMutation();
  const [updateText, { isLoading: isUpdating }] = useUpdateTextMutation();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetch();
  };

  const handleDeleteText = async () => {
    if (!selectedText) return;
    try {
      await deleteText(selectedText.id).unwrap();
      toast.success("Texto eliminado exitosamente");
      refetch();
      setOpenDeleteDialog(false);
    } catch {
      toast.error("Error al eliminar texto");
    }
  };

  const handleUpdateText = async () => {
    if (!selectedText) return;
    try {
      await updateText({
        id: selectedText.id,
        data: {
          content: editContent,
          time: selectedText.time,
          ideaId: selectedText.ideaId,
        },
      }).unwrap();
      toast.success("Texto actualizado exitosamente");
      refetch();
      setOpenEditDialog(false);
    } catch {
      toast.error("Error al actualizar texto");
    }
  };

  if (isLoadingUser || isLoadingTexts)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  if (isUserError || !user)
    return <Alert severity="error">Error al cargar el perfil</Alert>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        onClick={() => navigate("/home", { replace: true })}
        variant="contained"
        startIcon={<ArrowBack />}
        sx={{ mb: 4 }}
      >
        Volver al inicio
      </Button>

      {/* Perfil del Usuario */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          bgcolor: "background.paper",
          color: "text.primary",
          borderRadius: 3,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "center", sm: "flex-start" },
          justifyContent: "space-between",
          gap: 4,
          boxShadow: (theme) => theme.shadows[4],
        }}
      >
        {/* Sección izquierda: Avatar + datos */}
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: 32,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {user.email}
            </Typography>
            <Chip
              label={user.role}
              color="primary"
              variant="outlined"
              sx={{ fontSize: "0.75rem", height: "24px" }}
            />
          </Box>
        </Box>

        {/* Logout button a la derecha */}
        <Box alignSelf={{ xs: "center", sm: "flex-start" }}>
          <LogoutButton />
        </Box>
      </Paper>

      {/* Lista de textos */}
      <Typography variant="h5" mb={3}>
        <TextFieldsIcon /> Mis Textos
      </Typography>
      {isTextsError ? (
        <Alert severity="error">Error al cargar los textos</Alert>
      ) : texts.length > 0 ? (
        texts.map((text) => (
          <TextItem
            key={text.id}
            text={text}
            ideaTitle={ideasMap[text.ideaId]?.title || "Sin título"}
            onView={() => {
              setSelectedText(text);
              setOpenDialog(true);
            }}
            onEdit={() => {
              setSelectedText(text);
              setEditContent(text.content);
              setOpenEditDialog(true);
            }}
            onDelete={() => {
              setSelectedText(text);
              setOpenDeleteDialog(true);
            }}
            countWords={() => text.content.trim().split(/\s+/).length}
          />
        ))
      ) : (
        <Alert severity="info">No has escrito ningún texto aún</Alert>
      )}

      {/* Paginación */}
      <Box display="flex" justifyContent="center" gap={2} mt={4}>
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Anterior
        </Button>
        <Typography>Página {page}</Typography>
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={texts.length < 10}
        >
          Siguiente
        </Button>
      </Box>

      {/* Diálogo Ver Texto */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          {ideasMap[selectedText?.ideaId || 0]?.title || "Sin título"}
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.8,
              color: "text.secondary",
            }}
          >
            {selectedText?.content}
          </Typography>

          <Box display="flex" gap={1} mt={3}>
            <Chip
              icon={<AccessTimeIcon />}
              label={`${Math.floor(selectedText?.time! / 60)}:${(
                selectedText?.time! % 60
              )
                .toString()
                .padStart(2, "0")}`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
            <Chip
              icon={<TextFieldsIcon />}
              label={`${
                selectedText?.content.trim().split(/\s+/).length
              } palabras`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo Editar Texto */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>Editar texto</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{
              mt: 1,
              textarea: { color: "text.primary" },
              label: { color: "text.secondary" },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancelar</Button>
          <Button onClick={handleUpdateText} disabled={isUpdating}>
            {isUpdating ? <CircularProgress size={24} /> : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo Confirmar Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>¿Eliminar texto?</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro que deseas eliminar este texto?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteText}
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={24} /> : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
