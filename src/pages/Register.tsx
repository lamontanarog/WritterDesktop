import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../features/user/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, Button, Card, CardContent, CardHeader, Container, TextField, Typography, Alert, Link } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useRegisterMutation } from "../features/api/apiSlice";

const Register = () => {
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [register, { isLoading }] = useRegisterMutation();
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        dispatch(loginStart());

        try {
            const response = await register({ name, email, password }).unwrap();
            console.log('Register response:', response);
            
            if (response.token) {
                localStorage.setItem('token', response.token);
                
                // Obtener los datos del usuario actual
                const userResponse = await fetch('https://writterdesktopbackend.onrender.com/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${response.token}`
                    }
                });
                
                if (!userResponse.ok) {
                    throw new Error('Error al obtener datos del usuario');
                }
                
                const userData = await userResponse.json();
                console.log('User data:', userData);
                
                dispatch(loginSuccess(userData));
                navigate('/', { replace: true });
            } else {
                throw new Error('No se recibió token en la respuesta');
            }
        } catch (err) {
            console.error('Register error:', err);
            const errorMessage = 'Error al registrar el usuario. Por favor, intente nuevamente.';
            setError(errorMessage);
            dispatch(loginFailure(errorMessage));
        }
    }

    return (
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
                            Crear una cuenta
                        </Typography>
                    }
                    subheader={
                        <Typography variant="subtitle1" sx={{ color: "primary.contrastText", opacity: 0.9 }}>
                            Únete a nuestra plataforma
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
                        <PersonAddIcon fontSize="large" />
                    </Avatar>
                </Box>
                <CardContent sx={{ padding: 3, paddingTop: 4 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <form onSubmit={handleRegister}>
                        <TextField
                            id="name"
                            label="Nombre"
                            type="text"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ingresa tu nombre"
                            margin="normal"
                            required
                            disabled={isLoading}
                            sx={{
                                marginBottom: 2,
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
                        <TextField
                            id="email"
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu email"
                            margin="normal"
                            required
                            disabled={isLoading}
                            sx={{
                                marginBottom: 2,
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
                        <TextField
                            id="password"
                            label="Contraseña"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            margin="normal"
                            required
                            disabled={isLoading}
                            sx={{
                                marginBottom: 2,
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
                        <TextField
                            id="confirmPassword"
                            label="Confirmar Contraseña"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma tu contraseña"
                            margin="normal"
                            required
                            disabled={isLoading}
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
                            disabled={isLoading}
                            sx={{
                                padding: 1.5,
                                fontWeight: "bold",
                                textTransform: "none",
                                fontSize: "1rem",
                            }}
                        >
                            {isLoading ? 'Cargando...' : 'Registrarse'}
                        </Button>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2">
                                ¿Ya tienes una cuenta?{' '}
                                <Link 
                                    component="button" 
                                    variant="body2"
                                    onClick={() => navigate('/login')}
                                    sx={{ 
                                        color: 'primary.main',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Inicia sesión
                                </Link>
                            </Typography>
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Container>
    )
}

export default Register; 