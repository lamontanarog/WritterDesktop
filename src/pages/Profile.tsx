"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Button,
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
  Avatar,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
  TextField,
  Tooltip,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  TextFields as TextFieldsIcon,
  Visibility,
  ArrowBack,
} from "@mui/icons-material"
import { toast } from 'sonner'

import { useGetCurrentUserQuery, useGetTextsQuery, useDeleteTextMutation, useGetIdeasQuery, useUpdateTextMutation } from '../features/api/apiSlice'
import LogoutButton from '../components/LogoutButton'
import { Text } from '../types/text'
import { Idea } from '../types/idea'
import { skipToken } from '@reduxjs/toolkit/query/react'

const Profile = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [selectedText, setSelectedText] = useState<Text | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [editContent, setEditContent] = useState("")
  const [page, setPage] = useState(1);
  const { data: user, isLoading: isLoadingUser, isError: isUserError } = useGetCurrentUserQuery(undefined, {
    skip: !localStorage.getItem('token')
  })

  const { data: textsResponse, isLoading: isLoadingTexts, isError: isTextsError, refetch } = useGetTextsQuery({
    page,
    limit: 10, // Mantener el límite por página
  }, {
    skip: !localStorage.getItem('token'),
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    refetch(); // Refrescar los datos
  };

  const texts = textsResponse?.data || []

  // Obtener todos los IDs de ideas únicos
  const ideaIds = texts.map((text: Text) => text.ideaId).filter(Boolean) || []
  
  // Obtener todas las ideas
  const { data: ideasResponse } = useGetIdeasQuery({
    page: 1,
    limit: 100 // Un límite alto para obtener todas las ideas necesarias
  }, {
    skip: ideaIds.length === 0
  })

  // Crear un mapa de ideas para acceso más fácil
  const ideasMap = ideasResponse?.data.reduce((acc: Record<string, Idea>, idea: Idea) => {
    acc[idea.id] = idea;
    return acc;
  }, {}) || {};

  const [deleteText, { isLoading: isDeleting }] = useDeleteTextMutation()
  const [updateText, { isLoading: isUpdating }] = useUpdateTextMutation()

  const handleOpenDialog = (text: Text) => {
    setSelectedText(text)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedText(null)
  }

  const handleOpenDeleteDialog = (text: Text) => {
    setSelectedText(text)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
    setSelectedText(null)
  }

  const handleDeleteText = async () => {
    if (!selectedText) return

    try {
      console.log('Profile - Eliminando texto:', selectedText.id)
      await deleteText(selectedText.id).unwrap()
      console.log('Profile - Texto eliminado exitosamente')
      toast.success('Texto eliminado exitosamente')
      refetch()
      handleCloseDeleteDialog()
    } catch (error) {
      console.error('Profile - Error al eliminar texto:', error)
      toast.error('Error al eliminar texto')
    }
  }

  const handleOpenEditDialog = (text: Text) => {
    setSelectedText(text)
    setEditContent(text.content)
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false)
    setSelectedText(null)
    setEditContent("")
  }

  const handleUpdateText = async () => {
    if (!selectedText) return

    try {
      await updateText({
        id: selectedText.id,
        data: {
          content: editContent,
          time: selectedText.time,
          ideaId: selectedText.ideaId
        }
      }).unwrap()
      console.log('Profile - Texto actualizado exitosamente')
      toast.success('Texto actualizado exitosamente')
      refetch()
      handleCloseEditDialog()
    } catch (error) {
      console.error('Profile - Error al actualizar texto:', error)
      toast.error('Error al actualizar texto')
    }
  }

  if (isLoadingUser || isLoadingTexts) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (isUserError || !user) {
    return (
      <Box p={3}>
        <Alert severity="error">Error al cargar el perfil</Alert>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          onClick={() => navigate('/', { replace: true })} 
          variant="contained"
          startIcon={<ArrowBack />}
          sx={{ 
            mb: 4,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4],
            }
          }}
        >
          Volver al inicio
        </Button>
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={4}
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.secondary.light}15)`,
            borderRadius: 3,
            p: 3,
            boxShadow: theme.shadows[1],
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: theme.palette.primary.main,
                fontSize: '2rem',
                boxShadow: theme.shadows[3],
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {user.name}
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {user.email}
              </Typography>
              <Chip 
                label={user.role} 
                color="primary"
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  textTransform: 'capitalize',
                  fontWeight: 'medium'
                }}
              />
            </Box>
          </Box>
          <LogoutButton />
        </Box>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3,
          borderRadius: 3,
          background: theme.palette.background.paper,
          mb: 4
        }}
      >
        <Typography 
          variant="h5" 
          mb={3}
          sx={{
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <TextFieldsIcon color="primary" />
          Mis Textos
        </Typography>

        {isTextsError ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Error al cargar los textos
          </Alert>
        ) : texts && texts.length > 0 ? (
          <List sx={{ width: '100%' }}>
            {texts.map((text: Text, index: number) => {
              const idea = ideasMap[text.ideaId]
              const ideaTitle = idea?.title || 'Sin título'
              
              return (
                <Box key={text.id}>
                  <ListItem 
                    alignItems="flex-start"
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: `${theme.palette.primary.light}10`,
                        transform: 'translateX(8px)',
                      },
                      borderRadius: 2,
                      mb: 1
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: theme.palette.secondary.main,
                          boxShadow: theme.shadows[2]
                        }}
                      >
                        {ideaTitle.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography 
                            variant="h6"
                            sx={{ 
                              fontWeight: 'medium',
                              color: theme.palette.text.primary 
                            }}
                          >
                            {ideaTitle}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Ver texto completo">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDialog(text)}
                                sx={{ 
                                  bgcolor: `${theme.palette.info.main}15`,
                                  '&:hover': {
                                    bgcolor: `${theme.palette.info.main}25`,
                                  }
                                }}
                              >
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar texto">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenEditDialog(text)}
                                sx={{ 
                                  bgcolor: `${theme.palette.primary.main}15`,
                                  '&:hover': {
                                    bgcolor: `${theme.palette.primary.main}25`,
                                  }
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar texto">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDeleteDialog(text)}
                                sx={{ 
                                  bgcolor: `${theme.palette.error.main}15`,
                                  '&:hover': {
                                    bgcolor: `${theme.palette.error.main}25`,
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{ 
                              mb: 2,
                              lineHeight: 1.6,
                              opacity: 0.9
                            }}
                          >
                            {text.content.substring(0, 150)}...
                          </Typography>
                          <Box 
                            display="flex" 
                            gap={1} 
                            alignItems="center"
                            flexWrap="wrap"
                          >
                            <Chip
                              icon={<AccessTimeIcon />}
                              label={`${Math.floor(text.time / 60)}:${(text.time % 60).toString().padStart(2, '0')}`}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderRadius: 1,
                                bgcolor: `${theme.palette.primary.main}10`
                              }}
                            />
                            <Chip
                              icon={<TextFieldsIcon />}
                              label={`${text.wordCount} palabras`}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                borderRadius: 1,
                                bgcolor: `${theme.palette.secondary.main}10`
                              }}
                            />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                ml: 'auto',
                                color: theme.palette.text.secondary,
                                fontStyle: 'italic'
                              }}
                            >
                              {new Date(text.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < texts.length - 1 && (
                    <Divider 
                      variant="inset" 
                      component="li" 
                      sx={{ 
                        my: 2,
                        opacity: 0.5
                      }}
                    />
                  )}
                </Box>
              )
            })}
          </List>
        ) : (
          <Alert 
            severity="info" 
            sx={{ 
              borderRadius: 2,
              bgcolor: `${theme.palette.info.main}15`
            }}
          >
            No has escrito ningún texto aún
          </Alert>
        )}

        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center"
          gap={2}
          mt={4}
        >
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              minWidth: 100
            }}
          >
            Anterior
          </Button>
          <Typography 
            variant="body1" 
            sx={{ 
              px: 3,
              py: 1,
              borderRadius: 2,
              bgcolor: `${theme.palette.primary.main}15`,
              fontWeight: 'medium'
            }}
          >
            Página {page}
          </Typography>
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={!textsResponse}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              minWidth: 100
            }}
          >
            Siguiente
          </Button>
        </Box>
      </Paper>

      {/* Diálogo para ver el texto completo */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[5]
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
          {selectedText && ideasMap[selectedText.ideaId]?.title || 'Sin título'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
            {selectedText?.content}
          </Typography>
          <Box display="flex" gap={1} mt={3}>
            <Chip
              icon={<AccessTimeIcon />}
              label={`${Math.floor(selectedText?.time! / 60)}:${(selectedText?.time! % 60).toString().padStart(2, '0')}`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
            <Chip
              icon={<TextFieldsIcon />}
              label={`${selectedText?.wordCount} palabras`}
              size="small"
              variant="outlined"
              sx={{ borderRadius: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[5]
          }
        }}
      >
        <DialogTitle sx={{ color: theme.palette.error.main }}>
          ¿Eliminar texto?
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este texto? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteText} 
            color="error"
            variant="contained"
            disabled={isDeleting}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de edición */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: theme.shadows[5]
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
          Editar texto: {selectedText && ideasMap[selectedText.ideaId]?.title}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            sx={{ 
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: `${theme.palette.background.paper}`,
                '& fieldset': {
                  borderColor: theme.palette.divider,
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseEditDialog}
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateText}
            variant="contained"
            color="primary"
            disabled={isUpdating}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none'
            }}
          >
            {isUpdating ? <CircularProgress size={24} /> : 'Guardar cambios'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Profile

