import { useState } from "react"
import { useNavigate } from "react-router-dom"
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
} from "@mui/material"
import {
  Casino as CasinoIcon,
  Edit as EditIcon,
  Lightbulb as LightbulbIcon,
} from "@mui/icons-material"
import { useGetRandomIdeaQuery } from "../features/api/apiSlice"
import { Idea } from "../types/idea"
import { toast } from "sonner"

interface Props {
  setSelectedIdea: (idea: Idea) => void
}

const Randomizer = ({}: Props) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { data: randomIdea, refetch, isFetching } = useGetRandomIdeaQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const [attempts, setAttempts] = useState(0)

  const handleGenerateIdea = async () => {
    if (attempts >= 5) return
    const result = await refetch()
    const idea = result.data

    if (!idea?.title || !idea?.content) {
      setAttempts(a => a + 1)
      handleGenerateIdea()
    } else {
      setAttempts(0)
    }
  }

  const handleSelectIdea = () => {
    if (randomIdea?.id) {
      navigate("/write", { state: { ideaId: randomIdea.id } })
    } else {
      toast.error("Error al seleccionar la idea")
    }
  }

  const renderIdeaCard = () => {
    if (!randomIdea?.title || !randomIdea?.content) return null

    return (
      <Fade in timeout={800}>
        <Box sx={{ width: "100%", mt: 2, overflow: "visible" }}>
          <Card
            sx={{
              width: "100%",
              borderRadius: 2,
              boxShadow: 3,
              position: "relative",
              background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
              border: `1px solid ${theme.palette.divider}`,
              overflow: "visible",
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
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {randomIdea.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {randomIdea.content}
              </Typography>
            </CardContent>

            <CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
              <Tooltip title="Empezar a escribir con esta idea">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSelectIdea}
                  startIcon={<EditIcon />}
                  sx={{
                    borderRadius: 4,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      bgcolor: theme.palette.secondary.main,
                      color: theme.palette.secondary.contrastText,
                    },
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
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        width: "100%",
        maxWidth: { xs: 600, lg: "auto", xl: 800 },
        borderRadius: 2,
        boxShadow: theme.shadows[5],
        background: theme.palette.background.paper,
        mb: 4,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2, color: theme.palette.primary.main }}
      >
        <LightbulbIcon sx={{ mr: 1 }} />
        Generador de inspiración
      </Typography>

      <Typography variant="body1" color="text.secondary">¿Necesitás inspiración?</Typography>
      <Typography variant="subtitle2" color="gray" mb={3}>¡Usá nuestro generador para empezar a escribir!</Typography>

      <Button
        onClick={handleGenerateIdea}
        variant="contained"
        color="primary"
        size="large"
        disabled={isFetching}
        startIcon={isFetching ? <CircularProgress size={20} /> : <CasinoIcon />}
        sx={{ px: 3, py: 1, borderRadius: 2, mb: 2, boxShadow: 2, "&:hover": { boxShadow: 4 } }}
      >
        {isFetching ? "Generando..." : "Generar una idea aleatoria"}
      </Button>

      {isFetching ? <CircularProgress sx={{ mt: 2 }} /> : renderIdeaCard()}
    </Paper>
  )
}

export default Randomizer
