"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetIdeasQuery } from "../features/api/apiSlice";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Typography,
  Grid,
  CardActions,
  Divider,
  useTheme,
  Zoom,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Create as CreateIcon,
  FormatQuote as FormatQuoteIcon,
  Edit as EditIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { Idea } from "../types/idea";
import Randomizer from "../components/Randomizer";
import LogoutButton from "../components/LogoutButton";

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [bookmarkedIdeas, setBookmarkedIdeas] = useState<
    Record<string, boolean>
  >({});
  const [page, setPage] = useState(1);
  const {
    data: ideasData,
    isLoading,
    isError,
    refetch,
  } = useGetIdeasQuery(
    {
      page,
      limit: 10, // Mantener el límite por página
    },
    {
      skip: !localStorage.getItem("token"),
    }
  );
  const handleSelectIdea = (idea: Idea) => {
    navigate("/write", { state: { ideaId: idea.id } });
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIdeas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Manejar cambio de página
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetch(); // Refrescar los datos
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          bgcolor: `${theme.palette.error.light}20`,
          margin: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Error al cargar las ideas. Por favor, intente nuevamente.
        </Typography>
      </Paper>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Header: Profile & Logout */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button
          onClick={() => navigate("/profile")}
          variant="contained"
          startIcon={<AccountCircleIcon />}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            '&:hover': { boxShadow: theme.shadows[4] }
          }}
        >
          Mi Perfil
        </Button>
        <LogoutButton />
      </Box>

      {/* Título e introducción */}
      <Paper
        elevation={2}
        sx={{
          textAlign: 'center',
          mb: 6,
          p: 4,
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <CreateIcon
            sx={{ mr: 2, fontSize: 40, color: theme.palette.primary.main }}
          />
          Writing Inspiration
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto", mb: 4 }}
        >
          Choose an idea to spark your creativity or generate a random prompt to
          begin your writing journey
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Randomizer setSelectedIdea={handleSelectIdea} />
        </Box>
      </Paper>

      <Divider sx={{ mb: 6 }}>
        <Chip
          icon={<FormatQuoteIcon />}
          label="Writing Prompts"
          color="primary"
        />
      </Divider>

      <Grid container spacing={3}>
        {ideasData?.data?.map((idea: Idea, index: number) => (
          <Grid item xs={12} sm={6} md={4} key={idea.id}>
            <Zoom in timeout={500} style={{ transitionDelay: `${index * 100}ms` }}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  boxShadow: theme.shadows[1],
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: theme.shadows[6],
                  }
                }}
              >
                <CardHeader
                  title={
                    <Typography sx={{ fontWeight: 'bold' }}>{idea.title}</Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      {idea.content.substring(0, 80)}...
                    </Typography>
                  }
                  sx={{
                    bgcolor: `${theme.palette.primary.light}15`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.primary, lineHeight: 1.6 }}
                    gutterBottom
                  >
                    {idea.content.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                  <Button
                    onClick={() => handleSelectIdea(idea)}
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: theme.shadows[2],
                      '&:hover': { boxShadow: theme.shadows[4] }
                    }}
                  >
                    Escribir
                  </Button>
                  <Tooltip title="Ver detalles">
                    <IconButton onClick={() => handleSelectIdea(idea)}>
                      <FormatQuoteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Zoom>
          </Grid>
        ))}
      </Grid>

      {(!ideasData?.data || ideasData.data.length === 0) && (
        <Paper
          elevation={1}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: `${theme.palette.warning.light}20`,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No hay ideas disponibles. ¡Genera una idea aleatoria!
          </Typography>
        </Paper>
      )}

      {/* Paginación */}
      <Box display="flex" justifyContent="center" alignItems="center" mt={4} gap={2}>
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          variant="outlined"
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Anterior
        </Button>
        <Chip
          label={`Página ${page}`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 'medium' }}
        />
        <Button
          onClick={() => handlePageChange(page + 1)}
          disabled={!ideasData?.data || ideasData.data.length < 10}
          variant="outlined"
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Siguiente
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
