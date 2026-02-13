import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';
import api from '../services/api';

const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, loading } = useAuth();
    const [isApproved, setIsApproved] = useState<boolean | null>(null);
    const [checkingApproval, setCheckingApproval] = useState(true);
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;

        const checkStatus = async () => {
            if (isAuthenticated) {
                try {
                    const response = await api.get('/profile/');
                    if (isMounted) {
                        setIsApproved(response.data.profile?.is_approved || false);
                    }
                } catch (error) {
                    console.error('Failed verification', error);
                    if (isMounted) {
                        setIsApproved(false);
                    }
                }
            }
            if (isMounted) {
                setCheckingApproval(false);
            }
        };

        if (!loading) {
            if (isAuthenticated) {
                checkStatus();
            } else {
                if (isMounted) {
                    setCheckingApproval(false);
                }
            }
        }

        return () => { isMounted = false; };
    }, [isAuthenticated, loading]);

    if (loading || checkingApproval) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (isApproved === false && location.pathname !== '/pending-approval') {
        return <Navigate to="/pending-approval" replace />;
    }

    // Prevent accessing pending-approval if already approved
    if (isApproved === true && location.pathname === '/pending-approval') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
