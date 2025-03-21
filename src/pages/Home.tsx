"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setIdeas, selectIdea } from "../features/ideas/ideasSlice"
import type { RootState } from "../store"
import Randomizer from "../components/Randomizer"
import { useNavigate } from "react-router-dom"
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
} from "@mui/material"
import {
    Edit as EditIcon,
    Bookmark as BookmarkIcon,
    BookmarkBorder as BookmarkBorderIcon,
    Create as CreateIcon,
    FormatQuote as FormatQuoteIcon,
} from "@mui/icons-material"

// Define the Idea type
interface Idea {
    id: number
    title: string
    description: string
    bookmarked?: boolean
}

const Home = () => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const ideas = useSelector((state: RootState) => state.ideas.ideas)
    const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
    const navigate = useNavigate()
    const [bookmarkedIdeas, setBookmarkedIdeas] = useState<Record<number, boolean>>({})

    useEffect(() => {
        const fetchedIdeas: Idea[] = [
            {
                id: 1,
                title: "Write about a mysterious event",
                description: "Describe a moment of suspense or excitement that changed the course of someone's life",
            },
            {
                id: 2,
                title: "Write about a new technology",
                description: "Imagine how a revolutionary technology might transform society and human relationships",
            },
            {
                id: 3,
                title: "Write about a journey",
                description: "Tell the story of an unexpected adventure that leads to self-discovery",
            },
            {
                id: 4,
                title: "Write about a forgotten memory",
                description: "Explore how a resurfaced memory impacts the present",
            },
            {
                id: 5,
                title: "Write about a chance encounter",
                description: "Describe a brief meeting between strangers that has lasting consequences",
            },
        ]

        dispatch(setIdeas(fetchedIdeas))
    }, [dispatch])

    const handleSelectIdea = (idea: Idea) => {
        dispatch(selectIdea(idea))
        navigate("/write")
    }

    const toggleBookmark = (id: number) => {
        setBookmarkedIdeas((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Button onClick={() => navigate("/profile")} variant="contained">  👤 Profile </Button>
            <Box
                sx={{
                    textAlign: "center",
                    mb: 6,
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
                    <CreateIcon sx={{ mr: 2, fontSize: 40, color: theme.palette.primary.main }} />
                    Writing Inspiration
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: "auto", mb: 4 }}>
                    Choose an idea to spark your creativity or generate a random prompt to begin your writing journey
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Randomizer setSelectedIdea={setSelectedIdea} />
                </Box>
            </Box>

            <Divider sx={{ mb: 6 }}>
                <Chip icon={<FormatQuoteIcon />} label="Writing Prompts" color="primary" />
            </Divider>

            <Grid container spacing={3}>
                {ideas &&
                    ideas.map((idea, index) => (
                        <Grid item xs={12} sm={6} md={4} key={idea.id}>
                            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        borderRadius: 2,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <CardHeader
                                        title={
                                            <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                                                Prompt #{idea.id}
                                            </Typography>
                                        }
                                        action={
                                            <Tooltip title={bookmarkedIdeas[idea.id] ? "Remove bookmark" : "Bookmark this idea"}>
                                                <IconButton
                                                    aria-label="bookmark"
                                                    onClick={() => toggleBookmark(idea.id)}
                                                    color={bookmarkedIdeas[idea.id] ? "primary" : "default"}
                                                >
                                                    {bookmarkedIdeas[idea.id] ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                                </IconButton>
                                            </Tooltip>
                                        }
                                        sx={{
                                            bgcolor: `${theme.palette.primary.main}10`,
                                            borderBottom: `1px solid ${theme.palette.divider}`,
                                        }}
                                    />

                                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{
                                                color: theme.palette.text.primary,
                                                fontWeight: "medium",
                                                mb: 2,
                                            }}
                                        >
                                            {idea.title}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
                                            {idea.description}
                                        </Typography>
                                    </CardContent>

                                    <CardActions sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}>
                                        <Button
                                            onClick={() => handleSelectIdea(idea)}
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            sx={{
                                                borderRadius: 4,
                                                px: 2,
                                            }}
                                        >
                                            Start Writing
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Zoom>
                        </Grid>
                    ))}
            </Grid>

            {(!ideas || ideas.length === 0) && (
                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 2,
                        bgcolor: `${theme.palette.warning.light}20`,
                    }}
                >
                    <Typography variant="h6" color="text.secondary">
                        No writing prompts available. Try generating a random idea!
                    </Typography>
                </Paper>
            )}
        </Container>
    )
}

export default Home

