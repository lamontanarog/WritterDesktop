"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Fade,
  Paper,
  useTheme,
  Chip,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  Casino as CasinoIcon,
  Edit as EditIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetRandomIdeaQuery } from "../features/api/apiSlice";
import { Idea } from "../types/idea";

const Randomizer = ({
  
}: {
  setSelectedIdea: (idea: Idea) => void;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    data: randomIdea,
    refetch,
    isFetching
  } = useGetRandomIdeaQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [attempts, setAttempts] = useState(0);

  const handleGenerateIdea = async () => {
    if (attempts >= 5) return; // evita bucle infinito en caso de error persistente
    const result = await refetch();
    const idea = result.data;
    if (!idea || !idea.title || !idea.content) {
      setAttempts((prev) => prev + 1);
      handleGenerateIdea();
    } else {
      setAttempts(0);
    }
  };

  const handleSelectIdea = () => {
    if (randomIdea) {
      navigate("/write", { state: { ideaId: randomIdea?.id } });
    } else {
      console.log("Randomizer - No hay idea para seleccionar");
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        width: "100%",
        maxWidth: { xs: 600,lg : 'auto', xl: 800 },
        borderRadius: 2,
        boxShadow: theme.shadows[5],
        background: theme.palette.background.paper,
        mb: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            color: theme.palette.primary.main,
          }}
        >
          <LightbulbIcon sx={{ mr: 1 }} />
          Generador de inspiración
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
        ¿Necesita inspiración?
        </Typography>
        <Typography variant="subtitle2" color="gray" paragraph>
        ¡Utiliza nuestro generador de ideas para comenzar!
        </Typography>
        <Button
          onClick={handleGenerateIdea}
          variant="contained"
          color="primary"
          size="large"
          disabled={isFetching}
          startIcon={
            isFetching ? <CircularProgress size={20} /> : <CasinoIcon />
          }
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            mb: 3,
            boxShadow: 2,
            "&:hover": { boxShadow: 4 },
          }}
        >
          {isFetching ? "Generando..." : "Generar una idea aleatoria"}
        </Button>

        {isFetching ? (
          <Box sx={{ mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          randomIdea &&
          randomIdea.title &&
          randomIdea.content && (
            <Fade in timeout={800}>
              <Box sx={{ width: "100%", mt: 2 }}>
                <Card
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    boxShadow: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
                    border: `1px solid ${theme.palette.divider}`,
                    overflow: "visible",
                    position: "relative",
                  }}
                >
                  <Chip
                    icon={<LightbulbIcon />}
                    label="Posible idea"
                    color="secondary"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -12,
                      right: 16,
                      fontWeight: "bold",
                    }}
                  />

                  <CardContent sx={{ pt: 3 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                      }}
                    >
                      {randomIdea.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{ mb: 1 }}
                    >
                      {randomIdea.content}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
                    <Tooltip title="Empezar a escribir con esta idea">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={handleSelectIdea}
                        sx={{
                          borderRadius: 4,
                          color: theme.palette.primary.contrastText,
                          bgcolor: theme.palette.primary.main,
                          "&:hover": { bgcolor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText },
                        }}
                      >
                        Elegir para escribir
                      </Button>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Box>
            </Fade>
          )
        )}
      </Box>
    </Paper>
  );
};

export default Randomizer;
