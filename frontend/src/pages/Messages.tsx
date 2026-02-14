import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Divider,
    useTheme,
    alpha,
    CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import api from '../services/api';
import type { Message } from '../types';
import { useAuth } from '../contexts/AuthContext';

const MessagesPage: React.FC = () => {
    const theme = useTheme();
    const [user] = useState<any>(useAuth().user); // Access user from context
    const [messages, setMessages] = useState<Message[]>([]);
    const [nutritionist, setNutritionist] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef<null | HTMLDivElement>(null);

    const fetchData = async () => {
        try {
            const [msgRes, nutrRes] = await Promise.all([
                api.get('/messages/'),
                api.get('/nutritionists/')
            ]);

            setMessages(msgRes.data);

            if (nutrRes.data && nutrRes.data.length > 0) {
                setNutritionist(nutrRes.data[0].username);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            await api.post('/messages/mark_read/');
        } catch (error) {
            console.error("Failed to mark messages as read", error);
        }
    };

    useEffect(() => {
        fetchData();
        markAsRead();
        const interval = setInterval(() => {
            fetchData();
            markAsRead();
        }, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim() || !nutritionist) return;

        try {
            await api.post('/messages/', {
                content: newMessage,
                recipient: nutritionist
            });
            setNewMessage('');
            fetchData();
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4, height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" fontWeight={800}>Messages</Typography>
                {nutritionist && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.secondary">Chatting with:</Typography>
                        <Typography variant="subtitle2" fontWeight={700} color="primary">{nutritionist}</Typography>
                    </Box>
                )}
            </Box>

            <Paper sx={{
                flexGrow: 1,
                mb: 2,
                p: 2,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: alpha(theme.palette.background.default, 0.5),
                borderRadius: 4
            }}>
                {loading && messages.length === 0 ? (
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={24} sx={{ mb: 2 }} />
                        <Typography color="text.secondary">Loading conversation...</Typography>
                    </Box>
                ) : messages.length === 0 ? (
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography color="text.secondary">No messages yet. Start a conversation!</Typography>
                    </Box>
                ) : (
                    <List sx={{ width: '100%' }}>
                        {messages.map((msg, index) => {
                            const isMe = msg.sender === user?.username;
                            const showDate = index === 0 || new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString();

                            return (
                                <React.Fragment key={msg.id}>
                                    {showDate && (
                                        <Divider sx={{ my: 2 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(msg.timestamp).toLocaleDateString()}
                                            </Typography>
                                        </Divider>
                                    )}
                                    <ListItem alignItems="flex-start" sx={{
                                        flexDirection: isMe ? 'row-reverse' : 'row',
                                        gap: 1,
                                        px: 1
                                    }}>
                                        <ListItemAvatar sx={{ minWidth: 'auto', mb: 'auto' }}>
                                            <Avatar sx={{
                                                bgcolor: isMe ? theme.palette.primary.main : theme.palette.secondary.main,
                                                width: 32, height: 32, fontSize: 14
                                            }}>
                                                {msg.sender[0].toUpperCase()}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <Box sx={{
                                            maxWidth: '70%',
                                            bgcolor: isMe ? alpha(theme.palette.primary.main, 0.1) : '#fff',
                                            p: 2,
                                            borderRadius: 2,
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                            border: !isMe ? `1px solid ${theme.palette.divider}` : 'none'
                                        }}>
                                            <ListItemText
                                                primary={msg.content}
                                                secondary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </Typography>
                                                        {isMe && (
                                                            <Typography variant="caption" sx={{ color: msg.is_read ? 'primary.main' : 'text.disabled', ml: 1, fontWeight: 700 }}>
                                                                {msg.is_read ? 'READ' : 'SENT'}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                }
                                                primaryTypographyProps={{ variant: 'body1', style: { whiteSpace: 'pre-wrap' } }}
                                                secondaryTypographyProps={{ component: 'div' }}
                                            />
                                        </Box>
                                    </ListItem>
                                </React.Fragment>
                            );
                        })}
                        <div ref={bottomRef} />
                    </List>
                )}
            </Paper>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder={nutritionist ? "Type a message..." : "Waiting for nutritionist..."}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={!nutritionist}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <Button
                    variant="contained"
                    onClick={handleSend}
                    disabled={!newMessage.trim() || !nutritionist}
                    sx={{ px: 3, borderRadius: 3 }}
                >
                    <SendIcon />
                </Button>
            </Box>
        </Container>
    );
};

export default MessagesPage;
