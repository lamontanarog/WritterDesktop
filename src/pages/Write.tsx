// Write.tsx - Refactorizado para claridad y mantenimiento

"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  Chip,
  Tooltip,
  IconButton,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon,
  MenuBook as MenuBookIcon,
  Save as SaveIcon,
  TextFields as TextFieldsIcon,
} from "@mui/icons-material"
import { useGetIdeaByIdQuery, useCreateTextMutation } from "../features/api/apiSlice"
import { toast } from 'sonner'

const Write = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()
  const ideaId = useLocation().state?.ideaId

  const { data: idea, isLoading, isError } = useGetIdeaByIdQuery(ideaId, { skip: !ideaId })
  const [createText, { isLoading: isSaving }] = useCreateTextMutation()

  const [text, setText] = useState("")
  const [timer, setTimer] = useState(0)
  const [isWriting, setIsWriting] = useState(false)

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0
  const readingTime = Math.max(1, Math.ceil(wordCount / 200))

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isWriting) interval = setInterval(() => setTimer(t => t + 1), 1000)
      return () => {
        if (interval) clearInterval(interval)
      }      
  }, [isWriting])

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    if (!isWriting) setIsWriting(true)
  }

  const handleSave = async () => {
    if (!text.trim() || !idea) return
    if (wordCount < 10) return toast.error('El texto debe tener al menos 10 palabras')

    try {
      await createText({ ideaId: parseInt(idea.id), content: text, time: timer, wordCount }).unwrap()
      toast.success('Texto guardado exitosamente')
      navigate("/home", { replace: true })
    } catch (err) {
      console.error('Write - Error al guardar:', err)
      toast.error('Error al guardar el texto')
    }
  }

  if (!ideaId || isError) {
    return (
      <Container maxWidth="sm" sx={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", width: "100%" }}>
          <TextFieldsIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {isError ? 'Error al cargar la idea' : 'No hay idea seleccionada'}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {isError ? 'Ocurrió un error al obtener la idea.' : 'Selecciona una idea para comenzar a escribir'}
          </Typography>
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate("/home", { replace: true })} sx={{ mt: 2 }}>
            Volver al inicio
          </Button>
        </Paper>
      </Container>
    )
  }

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <IconButton onClick={() => navigate("/home", { replace: true })} aria-label="volver" sx={{ mb: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4" fontWeight="bold" gutterBottom>{idea?.title}</Typography>
        <Typography variant="body1" color="text.secondary" paragraph>{idea?.content}</Typography>

        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          mb={3}
          flexDirection={isMobile ? "column" : "row"}
          alignItems={isMobile ? "flex-start" : "center"}
        >
          <Chip icon={<AccessTimeIcon />} label={`Tiempo de escritura: ${formatTime(timer)}`} variant="outlined" color="primary" />
          <Tooltip title="Basado en 200 palabras por minuto">
            <Chip icon={<MenuBookIcon />} label={`Lectura: ${readingTime} min`} variant="outlined" color="secondary" />
          </Tooltip>
          <Chip icon={<TextFieldsIcon />} label={`${wordCount} palabras`} variant="outlined" />
        </Box>

        <Divider sx={{ mb: 3 }} />
      </Box>

      <Paper elevation={3} sx={{ mb: 4, transition: "all 0.3s ease", "&:hover": { boxShadow: 6 } }}>
        <TextField
          multiline
          fullWidth
          placeholder="Comienza a escribir aquí..."
          value={text}
          onChange={handleTextChange}
          variant="outlined"
          helperText={wordCount < 10 ? <Typography variant="subtitle2" color="error">El texto debe tener al menos 10 palabras</Typography> : ''}
          InputProps={{
            sx: {
              p: 2,
              fontSize: "1.1rem",
              lineHeight: 1.6,
              minHeight: "50vh",
              border: "none",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:focus-within .MuiOutlinedInput-notchedOutline": { border: "none" },
            },
          }}
        />
      </Paper>

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={isSaving || !text.trim()}
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          sx={{ px: 3, py: 1.5, borderRadius: 2, boxShadow: 2, "&:hover": { boxShadow: 4 } }}
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </Box>
    </Container>
  )
}

export default Write
