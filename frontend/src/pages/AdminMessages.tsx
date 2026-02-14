import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    TextField,
    IconButton,
    alpha,
    useTheme,
    Badge,
    CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import type { User, Message } from '../types';

const AdminMessages: React.FC = () => {
    const theme = useTheme();
    const { user } = useAuth();
    const [conversations, setConversations] = useState<User[]>([]);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [_loading, setLoading] = useState(true);
    const [conversationsLoading, setConversationsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const bottomRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedClient) {
            fetchMessages(selectedClient.username);
            const interval = setInterval(() => fetchMessages(selectedClient.username), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedClient]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const response = await api.get('/messages/conversations/');
            setConversations(response.data);
            if (response.data.length > 0 && !selectedClient) {
                setSelectedClient(response.data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch conversations", error);
        } finally {
            setConversationsLoading(false);
            setLoading(false);
        }
    };

    const fetchMessages = async (clientUsername: string) => {
        try {
            const response = await api.get(`/messages/?client_username=${clientUsername}`);
            setMessages(response.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedClient) return;

        try {
            const response = await api.post('/messages/', {
                content: newMessage,
                recipient: selectedClient.username
            });
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const filteredConversations = conversations.filter(c =>
        c.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 3 }}>
                Client Messages
            </Typography>

            <Grid container spacing={3} sx={{ flexGrow: 1, minHeight: 0 }}>
                {/* Conversations List */}
                <Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%' }}>
                    <Paper sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid rgba(226, 232, 240, 0.8)'
                    }}>
                        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                            <TextField
                                fullWidth
                                placeholder="Search clients..."
                                size="small"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: <SearchIcon sx={{ color: 'text.disabled', mr: 1 }} />,
                                }}
                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                            />
                        </Box>

                        <List sx={{ flexGrow: 1, overflowY: 'auto', py: 0 }}>
                            {conversationsLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress size={24} />
                                </Box>
                            ) : filteredConversations.length === 0 ? (
                                <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
                                    No conversations found
                                </Typography>
                            ) : (
                                filteredConversations.map((client) => (
                                    <ListItem
                                        key={client.id}
                                        disablePadding
                                        divider
                                    >
                                        <Box
                                            onClick={() => setSelectedClient(client)}
                                            sx={{
                                                width: '100%',
                                                p: 2,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'all 0.2s',
                                                bgcolor: selectedClient?.id === client.id ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                                '&:hover': {
                                                    bgcolor: selectedClient?.id === client.id ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.action.hover, 0.04),
                                                }
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Badge
                                                    variant="dot"
                                                    color="success"
                                                    overlap="circular"
                                                    invisible={false} // Would need an online status field
                                                >
                                                    <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700 }}>
                                                        {client.username[0].toUpperCase()}
                                                    </Avatar>
                                                </Badge>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={client.username}
                                                secondary={client.email}
                                                primaryTypographyProps={{ fontWeight: 700 }}
                                                secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                                            />
                                        </Box>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Paper>
                </Grid>

                {/* Chat Window */}
                <Grid size={{ xs: 12, md: 8 }} sx={{ height: '100%' }}>
                    <Paper sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid rgba(226, 232, 240, 0.8)'
                    }}>
                        {selectedClient ? (
                            <>
                                <Box sx={{
                                    p: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: alpha(theme.palette.background.default, 0.5)
                                }}>
                                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main', width: 40, height: 40 }}>
                                        {selectedClient.username[0].toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            Chat with {selectedClient.username}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {selectedClient.email}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#f8fafc' }}>
                                    {messages.map((msg) => {
                                        const isStaff = msg.sender === user?.username;
                                        return (
                                            <Box
                                                key={msg.id}
                                                sx={{
                                                    alignSelf: isStaff ? 'flex-end' : 'flex-start',
                                                    maxWidth: '70%',
                                                }}
                                            >
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 2,
                                                        borderRadius: isStaff ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                                        bgcolor: isStaff ? 'primary.main' : 'white',
                                                        color: isStaff ? 'white' : 'text.primary',
                                                        boxShadow: isStaff ? '0 4px 12px rgba(30, 64, 175, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                                                        border: isStaff ? 'none' : '1px solid rgba(226, 232, 240, 0.8)'
                                                    }}
                                                >
                                                    <Typography variant="body2">{msg.content}</Typography>
                                                </Paper>
                                                <Box sx={{ display: 'flex', justifyContent: isStaff ? 'flex-end' : 'flex-start', mt: 0.5, px: 1 }}>
                                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.65rem' }}>
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {isStaff && msg.is_read && (
                                                            <Box component="span" sx={{ ml: 1, color: 'primary.main', fontWeight: 800 }}>READ</Box>
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                    <div ref={bottomRef} />
                                </Box>

                                <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            placeholder="Type a response..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f1f5f9' } }}
                                        />
                                        <IconButton
                                            color="primary"
                                            onClick={handleSend}
                                            disabled={!newMessage.trim()}
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                '&:hover': { bgcolor: 'primary.dark' },
                                                '&.Mui-disabled': { bgcolor: alpha(theme.palette.action.disabled, 0.1) }
                                            }}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
                                <ChatIcon sx={{ fontSize: 64, mb: 2, opacity: 0.2 }} />
                                <Typography>Select a client to start chatting</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminMessages;
