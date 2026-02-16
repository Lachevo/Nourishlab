import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    alpha,
    useTheme,
    Avatar,
    Badge,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircle from '@mui/icons-material/CheckCircle';
import logo from '../assets/logo.jpg';
import PersonIcon from '@mui/icons-material/Person';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import ChatIcon from '@mui/icons-material/Chat';
import ScienceIcon from '@mui/icons-material/Science';


const drawerWidth = 260; // Slightly wider for a more spacious feel

const Layout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const theme = useTheme();

    // Different menu items for nutritionists vs regular users
    const menuItems = user?.profile?.is_nutritionist ? [
        { text: 'Nutritionist Dashboard', icon: <DashboardIcon />, path: '/nutritionist' },
        { text: 'Pending Approvals', icon: <CheckCircle sx={{ color: 'warning.main' }} />, path: '/nutritionist/approvals' },
        { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
        { text: 'Create Meal Plan', icon: <RestaurantMenuIcon />, path: '/nutritionist/create-meal-plan' },
        { text: 'Client Weekly Updates', icon: <TrendingUpIcon />, path: '/nutritionist/weekly-updates' },
        { text: 'Client Food Journals', icon: <FastfoodIcon />, path: '/nutritionist/food-journals' },
        { text: 'Client Lab Results', icon: <ScienceIcon />, path: '/nutritionist/lab-results' },
        { text: 'Client Messages', icon: <ChatIcon />, path: '/messages' },
    ] : [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
        { text: 'Meal Plans', icon: <RestaurantMenuIcon />, path: '/meal-plans' },
        { text: 'Weekly Updates', icon: <TrendingUpIcon />, path: '/weekly-updates' },
        { text: 'Food Journal', icon: <FastfoodIcon />, path: '/food-log' },
        { text: 'Lab Results', icon: <ScienceIcon />, path: '/lab-results' },
        { text: 'Messages', icon: <ChatIcon />, path: '/messages' },
    ];

    // Fetch unread messages count
    const [unreadCount, setUnreadCount] = React.useState(0);

    React.useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!user) return;
            try {
                // We'll need an endpoint for this, or just fetch messages and count
                // A lightweight endpoint for count would be better, but for now filtering messages is okay
                // Assuming we can use the messages endpoint
                // Note: We need to import api here.
                const { default: api } = await import('../services/api');
                const res = await api.get('/messages/?folder=inbox');
                const count = res.data.filter((m: any) => !m.is_read).length;
                setUnreadCount(count);
            } catch (error) {
                console.error("Failed to fetch unread count", error);
            }
        };

        fetchUnreadCount();

        // Listen for custom event from Messages page
        window.addEventListener('messagesRead', fetchUnreadCount);

        const interval = setInterval(fetchUnreadCount, 60000); // Check every minute
        return () => {
            clearInterval(interval);
            window.removeEventListener('messagesRead', fetchUnreadCount);
        };
    }, [user]);

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Box
                    component="img"
                    src={logo}
                    alt="NourishLab Logo"
                    sx={{
                        height: 120, // Increased from 70
                        width: 'auto',
                        mb: 2,
                        filter: theme.palette.mode === 'dark' ? 'invert(1) brightness(2)' : 'none',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.05)' }
                    }}
                />
            </Toolbar>
            <Box sx={{ px: 2, flexGrow: 1 }}>
                <List>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    selected={isActive}
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        borderRadius: 2,
                                        py: 1.5,
                                        px: 2,
                                        transition: 'all 0.2s',
                                        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        '&:hover': {
                                            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.15) : alpha(theme.palette.action.hover, 0.5),
                                            transform: 'translateX(4px)',
                                        },
                                        '&.Mui-selected': {
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.15),
                                            },
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{
                                        minWidth: 40,
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        transition: 'color 0.2s'
                                    }}>
                                        {/* Show badge only for Messages item */}
                                        {item.text.includes('Messages') && unreadCount > 0 ? (
                                            <Badge badgeContent={unreadCount} color="error" variant="dot">
                                                {item.icon}
                                            </Badge>
                                        ) : (
                                            item.icon
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                    {item.text.includes('Messages') && unreadCount > 0 && (
                                        <Box sx={{
                                            bgcolor: 'error.main',
                                            color: 'white',
                                            borderRadius: '10px',
                                            px: 0.8,
                                            py: 0.2,
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            ml: 1
                                        }}>
                                            {unreadCount}
                                        </Box>
                                    )}
                                    {isActive && !item.text.includes('Messages') && (
                                        <Box sx={{
                                            width: 4,
                                            height: 4,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            ml: 1
                                        }} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
            <Box sx={{ p: 2 }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => { logout(); navigate('/login'); }}
                            sx={{
                                borderRadius: 2,
                                color: 'text.secondary',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.error.main, 0.05),
                                    color: 'error.main',
                                    '& .MuiListItemIcon-root': { color: 'error.main' }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary', transition: 'color 0.2s' }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 600 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: alpha(theme.palette.background.default, 0.8),
                    backdropFilter: 'blur(12px)',
                    boxShadow: 'none',
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                    color: 'text.primary',
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        {/* Dynamic title removed to avoid duplication with page content */}
                    </Box>

                    {/* Placeholder for User Profile Menu/Avatar if needed */}
                    <IconButton size="small" sx={{ ml: 2 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>
                            {user?.username ? user.username[0].toUpperCase() : 'U'}
                        </Avatar>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            border: 'none',
                            bgcolor: 'background.paper'
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderRight: 'none',
                            boxShadow: '4px 0 32px rgba(0,0,0,0.015)',
                            bgcolor: 'background.paper'
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default Layout;
