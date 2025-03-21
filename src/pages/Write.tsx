"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store"
import { saveText } from "../features/ideas/ideasSlice"
import { useNavigate } from "react-router-dom"
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

const Write = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selectedIdea = useSelector((state: RootState) => state.ideas.selectedIdea)

  const [text, setText] = useState("")
  const [readingTime, setReadingTime] = useState(0)
  const [wordCount, setWordCount] = useState(0)
  const [isWriting, setIsWriting] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Start timer when writing begins
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isWriting) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isWriting])

  // Format timer to display as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)

    // Calculate word count
    const words = newText.trim() ? newText.trim().split(/\s+/).length : 0
    setWordCount(words)

    // Calculate reading time (average reading speed: 200 words per minute)
    const readingTimeInMinutes = Math.max(1, Math.ceil(words / 200))
    setReadingTime(readingTimeInMinutes)

    if (!isWriting) setIsWriting(true)
  }

  const handleSave = async () => {
    if (text.trim() === "") return

    setIsSaving(true)

    try {
      await dispatch(
        saveText({
          ideaId: selectedIdea!.id,
          title: selectedIdea!.title,
          content: text,
          time: timer,
          counter: wordCount,
        }),
      )
      navigate("/")
    } catch (error) {
      console.error("Failed to save:", error)
      setIsSaving(false)
    }
  }

  if (!selectedIdea) {
    return (
      <Container maxWidth="sm" sx={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center", width: "100%" }}>
          <TextFieldsIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No hay idea seleccionada
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Selecciona una idea para comenzar a escribir
          </Typography>
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate("/")} sx={{ mt: 2 }}>
            Volver al inicio
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <IconButton onClick={() => navigate("/")} sx={{ mb: 2 }} aria-label="volver">
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          {selectedIdea.title}
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          {selectedIdea.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
          }}
        >
          <Chip
            icon={<AccessTimeIcon />}
            label={`Tiempo de escritura: ${formatTime(timer)}`}
            color="primary"
            variant="outlined"
          />

          <Tooltip title="Basado en una velocidad de lectura promedio de 200 palabras por minuto">
            <Chip
              icon={<MenuBookIcon />}
              label={`Tiempo de lectura: ${readingTime} minutos`}
              color="secondary"
              variant="outlined"
            />
          </Tooltip>

          <Chip icon={<TextFieldsIcon />} label={`${wordCount} palabras`} variant="outlined" />
        </Box>

        <Divider sx={{ mb: 3 }} />
      </Box>

      <Paper
        elevation={3}
        sx={{
          mb: 4,
          overflow: "hidden",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 6,
          },
        }}
      >
        <TextField
          multiline
          fullWidth
          placeholder="Comienza a escribir aquí..."
          value={text}
          onChange={handleTextChange}
          variant="outlined"
          InputProps={{
            sx: {
              p: 2,
              fontSize: "1.1rem",
              lineHeight: 1.6,
              minHeight: "50vh",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:focus-within .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            },
          }}
        />
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
          onClick={handleSave}
          disabled={text.trim() === "" || isSaving}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            boxShadow: 2,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          {isSaving ? "Guardando..." : "Guardar y salir"}
        </Button>
      </Box>
    </Container>
  )
}

export default Write

