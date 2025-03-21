"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "../store"
import { deleteText } from "../features/ideas/ideasSlice"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Divider,
  Container,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  useTheme,
  CardHeader,
  Avatar,
  Modal,
  Fade,
  Backdrop,
  Tooltip,
  Alert,
  AlertTitle,
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
  TextFields as TextFieldsIcon,
  Close as CloseIcon,
} from "@mui/icons-material"

// Define the SavedText interface
interface SavedText {
  ideaId: number
  title?: string
  content: string
  time: number
  counter: number
}

const Profile = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const savedTexts = useSelector((state: RootState) => state.ideas.savedTexts)

  // State for modal
  const [selectedText, setSelectedText] = useState<SavedText | null>(null)
  const [openModal, setOpenModal] = useState(false)

  // State for delete confirmation
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [textToDelete, setTextToDelete] = useState<number | null>(null)

  // Format time (assuming time is in seconds)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleOpenModal = (text: SavedText) => {
    setSelectedText(text)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleDeleteConfirm = (index: number) => {
    setTextToDelete(index)
    setDeleteConfirmOpen(true)
  }

  const handleDelete = () => {
    if (textToDelete !== null) {
      dispatch(deleteText({ index: textToDelete }))
      setDeleteConfirmOpen(false)
      setTextToDelete(null)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <IconButton onClick={() => navigate("/")} sx={{ mr: 2 }} aria-label="volver" color="primary">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Mis Textos Guardados
        </Typography>
      </Box>

      {savedTexts.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: `${theme.palette.info.light}10`,
          }}
        >
          <Alert severity="info" sx={{ justifyContent: "center" }}>
            <AlertTitle>No hay textos guardados</AlertTitle>
            Comienza a escribir para ver tus textos aquí
          </Alert>
          <Button variant="contained" color="primary" onClick={() => navigate("/")} sx={{ mt: 3 }}>
            Comenzar a escribir
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {savedTexts.map((text, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      {text.title ? text.title.charAt(0).toUpperCase() : "T"}
                    </Avatar>
                  }
                  title={
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {text.title || "Texto sin título"}
                    </Typography>
                  }
                  subheader={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
                      <Chip
                        icon={<AccessTimeIcon fontSize="small" />}
                        label={`${formatTime(text.time)}`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<TextFieldsIcon fontSize="small" />}
                        label={`${text.counter} palabras`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  }
                  sx={{ pb: 0 }}
                />

                <CardContent sx={{ flexGrow: 1, pt: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      overflow: "hidden",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      mb: 2,
                      height: "4.5em",
                    }}
                  >
                    {text.content}
                  </Typography>

                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
                    <Tooltip title="Eliminar texto">
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteConfirm(index)}
                      >
                        Eliminar
                      </Button>
                    </Tooltip>

                    <Tooltip title="Ver texto completo">
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleOpenModal(text)}
                      >
                        Ver
                      </Button>
                    </Tooltip>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* View Text Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{
          backdrop: Backdrop,
        }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "80%", md: "60%" },
              maxWidth: 800,
              maxHeight: "90vh",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              overflow: "auto",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" component="h2" fontWeight="bold">
                {selectedText?.title || "Texto sin título"}
              </Typography>
              <IconButton onClick={handleCloseModal} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <Chip
                icon={<AccessTimeIcon />}
                label={`Tiempo de escritura: ${selectedText ? formatTime(selectedText.time) : "0:00"}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                icon={<TextFieldsIcon />}
                label={`${selectedText?.counter || 0} palabras`}
                color="secondary"
                variant="outlined"
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: `${theme.palette.background.default}`,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
                {selectedText?.content}
              </Typography>
            </Paper>
          </Box>
        </Fade>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar este texto? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Profile

