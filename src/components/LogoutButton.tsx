import { Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';

const LogoutButton = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const theme = useTheme();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{color: theme.palette.primary.contrastText }}
        >
            Cerrar Sesión
        </Button>
    );
};

export default LogoutButton; 