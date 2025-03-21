import { useDispatch } from "react-redux";
import { login } from "../features/user/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Card, CardContent, CardHeader, Container, FormLabel, Input, TextField, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person"

const Login = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const navigator = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username) {
            dispatch(login('test'));
        }
        navigator('/');
    }

    return (

        <>
            <Container
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    minWidth: "100vw",
                    backgroundColor: "primary.dark",
                    padding: 2,
                }}
            >
                <Card
                    sx={{
                        maxWidth: 400,
                        width: "100%",
                        boxShadow: 3,
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    <CardHeader
                        sx={{
                            backgroundColor: "primary.main",
                            color: "primary.contrastText",
                            textAlign: "center",
                            padding: 3,
                        }}
                        title={
                            <Typography variant="h5" component="div" fontWeight="bold">
                                Welcome to Writing Platform
                            </Typography>
                        }
                        subheader={
                            <Typography variant="subtitle1" sx={{ color: "primary.contrastText", opacity: 0.9 }}>
                                Sign in to continue
                            </Typography>
                        }
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: -3,
                        }}
                    >
                        <Avatar
                            sx={{
                                backgroundColor: "white",
                                color: "primary.main",
                                width: 56,
                                height: 56,
                                boxShadow: 1,
                            }}
                        >
                            <PersonIcon fontSize="large" />
                        </Avatar>
                    </Box>
                    <CardContent sx={{ padding: 3, paddingTop: 4 }}>
                        <form onSubmit={handleLogin}>
                            <TextField
                                id="username"
                                label="Username"
                                variant="outlined"
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                margin="normal"
                                required
                                sx={{
                                    marginBottom: 3,
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused fieldset": {
                                            borderColor: "primary.main",
                                        },
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "primary.main",
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                sx={{
                                    padding: 1.5,
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                }}
                            >
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </>
    )
}

export default Login;