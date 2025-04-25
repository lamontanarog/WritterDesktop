import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';

const LogoutButton = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            // sx={{ marginLeft: 'auto' }}
        >
            Cerrar Sesión
        </Button>
    );
};

export default LogoutButton; 