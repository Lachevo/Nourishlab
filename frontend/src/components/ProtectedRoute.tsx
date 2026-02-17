import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const isStaff = user?.is_staff || false;
    const profile = user?.profile;
    const isApproved = profile?.is_approved || false;

    // Profile is complete if age is set (required in the form)
    const isProfileComplete = !!profile && profile.age !== null && profile.age !== undefined;

    // Staff/Nutritionists skip the client onboarding/approval flow
    if (isStaff) {
        return <Outlet />;
    }

    // Client flow:
    // 1. Allow access to complete-profile page
    if (location.pathname === '/complete-profile') {
        return <Outlet />;
    }

    // 2. Redirect to complete-profile if profile is incomplete
    if (!isProfileComplete) {
        return <Navigate to="/complete-profile" replace />;
    }

    // 3. Redirect to pending-approval if not approved
    if (!isApproved && location.pathname !== '/pending-approval') {
        return <Navigate to="/pending-approval" replace />;
    }

    // 4. Prevent accessing pending-approval or complete-profile if all OK
    if (isApproved && isProfileComplete &&
        (location.pathname === '/pending-approval' || location.pathname === '/complete-profile')) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
