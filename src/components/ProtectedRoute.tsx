import { useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../features/api/apiSlice';
import { CircularProgress, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/user/userSlice';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('USER' | 'ADMIN')[];
    role?: 'USER' | 'ADMIN';
}

const ProtectedRoute = ({ children, allowedRoles, role }: ProtectedRouteProps) => {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const location = useLocation();
    const { data: user, isLoading, isError } = useGetCurrentUserQuery(undefined, {
        skip: !isAuthenticated
      });

    const neededRoles = allowedRoles ?? (role ? [role] : undefined);

    const shouldRedirect = useMemo(() => {
        if (isLoading) return false;
        if (isError) return true;
        if (!user) return true;
        if (neededRoles && !neededRoles.includes(user.role)) return true;
        return false;
    }, [user, isLoading, isError, neededRoles]);

    const redirectPath = useMemo(() => {
        if (isError || !user) return '/login';
        if (neededRoles && !neededRoles.includes(user.role)) {
            return user.role === 'ADMIN' ? '/admin/dashboard' : '/';
        }
        return null;
    }, [user, isError, neededRoles]);

    useEffect(() => {
        if (shouldRedirect && redirectPath) {
            localStorage.setItem('redirectAfterLogin', location.pathname);
        }
    }, [shouldRedirect, redirectPath, location.pathname]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (shouldRedirect) {
        return <Navigate to={redirectPath || '/login'} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;