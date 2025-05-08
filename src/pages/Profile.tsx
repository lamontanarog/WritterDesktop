// Profile.tsx refactorizado para mayor claridad y legibilidad

import { useState, useMemo, useEffect } from "react";
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
  useTheme,
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
  const theme = useTheme();

  const [page, setPage] = useState(1);
  const [selectedText, setSelectedText] = useState<Text | null>(null);
  const [editContent, setEditContent] = useState("");
  const [dialogs, setDialogs] = useState({
    view: false,
    edit: false,
    delete: false,
  });

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
  } = useGetTextsQuery({ page, limit: 10 }, {
    skip: !localStorage.getItem("token"),
  });

  const { data: ideasResponse } = useGetIdeasQuery(
    { page: 1, limit: 100 },
    { skip: !textsResponse?.data.length }
  );

  useEffect(() => {
    if (user) {
      refetch(); // fuerza que se recarguen los textos para el nuevo usuario
    }
  }, [user]);

  const [deleteText, { isLoading: isDeleting }] = useDeleteTextMutation();
  const [updateText, { isLoading: isUpdating }] = useUpdateTextMutation();

  const ideasMap = useMemo(() => {
    return ideasResponse?.data.reduce((acc, idea) => {
      if (typeof idea.id === "number") acc[idea.id] = idea;
      return acc;
    }, {} as Record<number, Idea>) || {};
  }, [ideasResponse]);

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
      setDialogs((d) => ({ ...d, delete: false }));
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
      setDialogs((d) => ({ ...d, edit: false }));
    } catch {
      toast.error("Error al actualizar texto");
    }
  };

  const texts = textsResponse?.data || [];

  if (isLoadingUser || isLoadingTexts) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (isUserError || !user) {
    return <Alert severity="error">Error al cargar el perfil</Alert>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        onClick={() => navigate("/home", { replace: true })}
        variant="contained"
        startIcon={<ArrowBack />}
        sx={{ mb: 4, color: theme.palette.primary.contrastText }}
      >
        Volver al inicio
      </Button>

      {/* Perfil del Usuario */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", justifyContent: "space-between", gap: 4 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar sx={{ width: 80, height: 80 }}>{user.name.charAt(0).toUpperCase()}</Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
          </Box>
        </Box>
        <LogoutButton />
      </Paper>
      {/* Lista de textos */}
      <Typography variant="h5" mb={3}><TextFieldsIcon /> Mis Textos</Typography>
      {isTextsError ? (
        <Alert severity="error">Error al cargar los textos</Alert>
      ) : texts.length > 0 ? (
        texts.map((text) => (
          <TextItem
            key={text.id}
            text={text}
            ideaTitle={ideasMap[text.ideaId]?.title || "Sin título"}
            onView={() => { setSelectedText(text); setDialogs((d) => ({ ...d, view: true })); }}
            onEdit={() => { setSelectedText(text); setEditContent(text.content); setDialogs((d) => ({ ...d, edit: true })); }}
            onDelete={() => { setSelectedText(text); setDialogs((d) => ({ ...d, delete: true })); }}
            countWords={() => text.content.trim().split(/\s+/).length}
          />
        ))
      ) : (
        <Alert severity="info">No has escrito ningún texto aún</Alert>
      )}

      {/* Paginación */}
      <Box display="flex" justifyContent="center" gap={2} mt={4}>
        <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Anterior</Button>
        <Typography>Página {page}</Typography>
        <Button onClick={() => handlePageChange(page + 1)} disabled={texts.length < 10}>Siguiente</Button>
      </Box>

      {/* Diálogos (ver, editar, eliminar) */}
      <Dialog open={dialogs.view} onClose={() => setDialogs((d) => ({ ...d, view: false }))} maxWidth="md" fullWidth>
        <DialogTitle>{ideasMap[selectedText?.ideaId || 0]?.title || "Sin título"}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{selectedText?.content}</Typography>
          <Box display="flex" gap={1} mt={3}>
            <Chip icon={<AccessTimeIcon />} label={`${Math.floor((selectedText?.time || 0) / 60)}:${((selectedText?.time || 0) % 60).toString().padStart(2, "0")}`} size="small" variant="outlined" />
            <Chip icon={<TextFieldsIcon />} label={`${selectedText?.content.trim().split(/\s+/).length || 0} palabras`} size="small" variant="outlined" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogs((d) => ({ ...d, view: false }))}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogs.edit} onClose={() => setDialogs((d) => ({ ...d, edit: false }))} maxWidth="md" fullWidth>
        <DialogTitle>Editar texto</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline rows={10} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogs((d) => ({ ...d, edit: false }))}>Cancelar</Button>
          <Button onClick={handleUpdateText} disabled={isUpdating}>{isUpdating ? <CircularProgress size={24} /> : "Guardar"}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogs.delete} onClose={() => setDialogs((d) => ({ ...d, delete: false }))}>
        <DialogTitle>¿Eliminar texto?</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro que deseas eliminar este texto?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogs((d) => ({ ...d, delete: false }))}>Cancelar</Button>
          <Button onClick={handleDeleteText} color="error" disabled={isDeleting}>{isDeleting ? <CircularProgress size={24} /> : "Eliminar"}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
