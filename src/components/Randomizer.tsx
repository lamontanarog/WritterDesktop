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
} from "@mui/material"
import { Casino as CasinoIcon, Edit as EditIcon, Lightbulb as LightbulbIcon } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"

// Define the Idea type
interface Idea {
    id: number
    title: string
    description: string
}

const ideaPool: Idea[] = [
    {
        id: 1,
        title: "Write about a mysterious event",
        description: "Describe a moment of suspense or excitement that changed everything",
    },
    {
        id: 2,
        title: "Write about a new technology",
        description: "Imagine how a futuristic technology might impact everyday life",
    },
    {
        id: 3,
        title: "Write about an alien invasion",
        description: "Create a scenario where Earth encounters extraterrestrial beings",
    },
    {
        id: 4,
        title: "Write about a hidden talent",
        description: "Explore a character who discovers an unusual ability they never knew they had",
    },
    {
        id: 5,
        title: "Write about a time traveler",
        description: "Describe someone who accidentally travels to a different era",
    },
]

const Randomizer = ({ setSelectedIdea }: { setSelectedIdea: (idea: Idea) => void }) => {
    const theme = useTheme()
    const [randomIdea, setRandomIdea] = useState<Idea | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const navigate = useNavigate()

    const generateRandomIdea = () => {
        setIsGenerating(true)

        // Add a small delay for animation effect
        setTimeout(() => {
            const idea = ideaPool[Math.floor(Math.random() * ideaPool.length)]
            setRandomIdea(idea)
            setIsGenerating(false)
        }, 600)
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
                    onClick={generateRandomIdea}
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isGenerating}
                    startIcon={<CasinoIcon />}
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
                    {isGenerating ? "Generating..." : "Generate Random Idea"}
                </Button>

                <Fade in={randomIdea !== null} timeout={800}>
                    <Box sx={{ width: "100%" }}>
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
                                        {randomIdea.description}
                                    </Typography>
                                </CardContent>

                                <CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
                                    <Tooltip title="Start writing with this idea">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => {
                                                setSelectedIdea(randomIdea)
                                                navigate("/write")
                                            }}

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
            </Box>
        </Paper>
    )
}

export default Randomizer

