"use client"

import { useState } from "react"
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
import { Casino as CasinoIcon, Edit as EditIcon, Lightbulb as LightbulbIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useGetRandomIdeaQuery } from "../features/api/apiSlice"
import { Idea } from "../types/idea"

const Randomizer = ({ setSelectedIdea }: { setSelectedIdea: (idea: Idea) => void }) => {
    const theme = useTheme()
    const navigate = useNavigate()
    const { data: randomIdea, refetch, isFetching, isError } = useGetRandomIdeaQuery(undefined, {
        refetchOnMountOrArgChange: true
    })


    const handleGenerateIdea = async () => {
        try {
            
            await refetch()
            
        } catch (error) {
            console.error("Error al generar idea aleatoria:", error)
        }
    }

    const handleSelectIdea = () => {
        if (randomIdea) {
            navigate("/write", { state: { ideaId: randomIdea?.id } })
        } else {
            console.log('Randomizer - No hay idea para seleccionar')
        }
    }

    return (
        <Paper
            elevation={3}
            sx={{
                p: 3,
                width: "100%",
                maxWidth: 500,
                borderRadius: 2,
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
                    Inspiration Generator
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                    Need inspiration? Generate a random writing prompt to get your creativity flowing.
                </Typography>

                <Button
                    onClick={handleGenerateIdea}
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isFetching}
                    startIcon={isFetching ? <CircularProgress size={20} /> : <CasinoIcon />}
                    sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        mb: 3,
                        boxShadow: 2,
                        "&:hover": {
                            boxShadow: 4,
                        },
                    }}
                >
                    {isFetching ? "Generating..." : "Generate Random Idea"}
                </Button>

                {/* Handling fallback and idea display */}
                {isFetching ? (
                  <Box sx={{ mt: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : (!randomIdea || isError || !randomIdea.title || !randomIdea.content) ? (
                  <Paper elevation={3} sx={{ p: 3, textAlign: 'center', mt: 2 }}>
                    {isError ? (
                      <Typography color="error" gutterBottom>
                        Error al obtener idea. Inténtalo de nuevo.
                      </Typography>
                    ) : (
                      <Typography color="warning.main" gutterBottom>
                        No se encontró una idea válida.
                      </Typography>
                    )}
                    <Button
                      onClick={handleGenerateIdea}
                      variant="outlined"
                      disabled={isFetching}
                      sx={{ mt: 1, textTransform: 'none' }}
                    >
                      {isFetching ? <CircularProgress size={16} /> : 'Generar idea'}
                    </Button>
                  </Paper>
                ) : (
                  <Fade in timeout={800} style={{ transitionDelay: randomIdea ? '200ms' : '0ms' }}>
                    <Box sx={{ width: "100%", mt: 2 }}>
                      {randomIdea && (
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
                                    label="Random Idea"
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
                                        sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
                                    >
                                        {randomIdea.title}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 1 }}>
                                        {randomIdea.content}
                                    </Typography>
                                </CardContent>

                                <CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
                                    <Tooltip title="Start writing with this idea">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={handleSelectIdea}
                                            sx={{ borderRadius: 4 }}
                                        >
                                            Select to write
                                        </Button>
                                    </Tooltip>
                                </CardActions>
                            </Card>
                        )}
                    </Box>
                  </Fade>
                )}
            </Box>
        </Paper>
    )
}

export default Randomizer

