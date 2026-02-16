import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Divider,
    TextField,
    Box,
    IconButton,
    Badge,
    Fab,
    CircularProgress,
    Button
} from '@mui/material';
import { Send, Add, ArrowBack } from '@mui/icons-material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ComposeMessage from '../components/ComposeMessage';

interface Message {
    id: number;
    sender: string;
    sender_name: string;
    recipient: string;
    recipient_name: string;
    subject: string;
    content: string;
    timestamp: string;
    is_read: boolean;
}

interface Conversation {
    partner_username: string;
    partner_name: string; // We might not have this from API, use username or fetch profile
    last_message: Message;
    unread_count: number;
}

const Messages: React.FC = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [composeOpen, setComposeOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 30 seconds
        const interval = setInterval(fetchMessages, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, selectedPartner]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            // Fetch all messages (inbox and sent) to build conversations
            // We could optimize this with a dedicated conversations endpoint
            const res = await api.get('/messages/');
            const allMessages: Message[] = res.data;
            setMessages(allMessages);
            organizeConversations(allMessages);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        } finally {
            setLoading(false);
        }
    };

    const organizeConversations = (allMessages: Message[]) => {
        if (!user) return;

        const convs: { [key: string]: Conversation } = {};

        allMessages.forEach(msg => {
            const isSender = msg.sender === user.username; // Assuming sender is username in API response
            // The partner is the other person in the conversation
            // Note: API returns sender as string (username) based on Serializer

            // Check if sender/recipient fields are usernames or IDs based on serializer
            // MessageSerializer: sender = StringRelatedField (username), recipient = SlugRelatedField (username)
            // So they are usernames.

            const partner = isSender ? msg.recipient : msg.sender;

            if (!convs[partner]) {
                convs[partner] = {
                    partner_username: partner,
                    partner_name: partner, // We could fetch real name if available
                    last_message: msg,
                    unread_count: 0
                };
            }

            // Update last message if this one is newer
            if (new Date(msg.timestamp) > new Date(convs[partner].last_message.timestamp)) {
                convs[partner].last_message = msg;
            }

            if (!isSender && !msg.is_read) {
                convs[partner].unread_count++;
            }
        });

        // Convert to array and sort by last message timestamp
        const sortedConvs = Object.values(convs).sort((a, b) =>
            new Date(b.last_message.timestamp).getTime() - new Date(a.last_message.timestamp).getTime()
        );

        setConversations(sortedConvs);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedPartner || !newMessage.trim()) return;

        try {
            setSending(true);
            const res = await api.post('/messages/', {
                recipient: selectedPartner,
                content: newMessage
            });

            // Optimistically add message
            const newMsg = res.data;
            const updatedMessages = [...messages, newMsg];
            setMessages(updatedMessages);
            organizeConversations(updatedMessages);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message', err);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handlePartnerSelect = (partner: string) => {
        setSelectedPartner(partner);
        markConversationRead(partner);
    };

    const markConversationRead = async (partner: string) => {
        try {
            await api.post('/messages/mark_read/', { sender_username: partner });
            // Update local state
            const updatedMessages = messages.map(msg =>
                msg.sender === partner && !msg.is_read ? { ...msg, is_read: true } : msg
            );
            setMessages(updatedMessages);
            organizeConversations(updatedMessages);

            // Trigger layout refresh
            window.dispatchEvent(new CustomEvent('messagesRead'));
        } catch (err) {
            console.error('Failed to mark conversation as read', err);
        }
    };

    // Filter messages for selected conversation
    const currentMessages = messages.filter(msg =>
        (msg.sender === user?.username && msg.recipient === selectedPartner) ||
        (msg.recipient === user?.username && msg.sender === selectedPartner)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, height: 'calc(100vh - 140px)' }}>
            <Paper sx={{ height: '100%', display: 'flex', overflow: 'hidden' }}>
                {/* Conversations Sidebar */}
                <Box sx={{
                    width: { xs: selectedPartner ? 0 : '100%', md: 350 },
                    borderRight: '1px solid rgba(0,0,0,0.12)',
                    display: { xs: selectedPartner ? 'none' : 'flex', md: 'flex' },
                    flexDirection: 'column'
                }}>
                    <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold">Messages</Typography>
                        <Fab size="small" color="primary" onClick={() => setComposeOpen(true)}>
                            <Add />
                        </Fab>
                    </Box>
                    <Divider />
                    <List sx={{ overflow: 'auto', flex: 1 }}>
                        {conversations.length === 0 ? (
                            <Box p={3} textAlign="center">
                                <Typography color="text.secondary">No messages yet</Typography>
                            </Box>
                        ) : (
                            conversations.map((conv) => (
                                <ListItem
                                    key={conv.partner_username}
                                    disablePadding
                                >
                                    <ListItemButton
                                        selected={selectedPartner === conv.partner_username}
                                        onClick={() => handlePartnerSelect(conv.partner_username)}
                                        alignItems="flex-start"
                                    >
                                        <ListItemAvatar>
                                            <Avatar>{conv.partner_username.charAt(0).toUpperCase()}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Box display="flex" justifyContent="space-between">
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {conv.partner_username}
                                                    </Typography>
                                                    {conv.unread_count > 0 && (
                                                        <Badge badgeContent={conv.unread_count} color="primary" />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {conv.last_message.sender === user?.username && 'You: '}
                                                    {conv.last_message.content}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        )}
                    </List>
                </Box>

                {/* Message Thread Area */}
                <Box sx={{
                    flex: 1,
                    display: { xs: selectedPartner ? 'flex' : 'none', md: 'flex' },
                    flexDirection: 'column'
                }}>
                    {selectedPartner ? (
                        <>
                            {/* Header */}
                            <Box p={2} borderBottom="1px solid rgba(0,0,0,0.12)" display="flex" alignItems="center">
                                <IconButton
                                    sx={{ display: { md: 'none' }, mr: 1 }}
                                    onClick={() => setSelectedPartner(null)}
                                >
                                    <ArrowBack />
                                </IconButton>
                                <Avatar sx={{ mr: 2 }}>{selectedPartner.charAt(0).toUpperCase()}</Avatar>
                                <Typography variant="h6">{selectedPartner}</Typography>
                            </Box>

                            {/* Messages List */}
                            <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
                                {currentMessages.map((msg) => {
                                    const isMe = msg.sender === user?.username;
                                    return (
                                        <Box
                                            key={msg.id}
                                            display="flex"
                                            justifyContent={isMe ? 'flex-end' : 'flex-start'}
                                            mb={2}
                                        >
                                            <Paper sx={{
                                                p: 2,
                                                maxWidth: '70%',
                                                bgcolor: isMe ? 'primary.main' : 'white',
                                                color: isMe ? 'white' : 'text.primary',
                                                borderRadius: 2
                                            }}>
                                                {msg.subject && (
                                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                        {msg.subject}
                                                    </Typography>
                                                )}
                                                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
                                                <Typography variant="caption" display="block" textAlign="right" sx={{ mt: 1, opacity: 0.8 }}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </Box>

                            {/* Input Area */}
                            <Box p={2} component="form" onSubmit={handleSendMessage} bgcolor="white" borderTop="1px solid rgba(0,0,0,0.12)">
                                <Box display="flex" gap={2}>
                                    <TextField
                                        fullWidth
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        size="small"
                                        autoComplete="off"
                                    />
                                    <IconButton
                                        color="primary"
                                        type="submit"
                                        disabled={!newMessage.trim() || sending}
                                    >
                                        {sending ? <CircularProgress size={24} /> : <Send />}
                                    </IconButton>
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <Box flex={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" bgcolor="#f5f5f5">
                            <Typography variant="h5" color="text.secondary" gutterBottom>
                                Select a conversation
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={() => setComposeOpen(true)}
                            >
                                New Message
                            </Button>
                        </Box>
                    )}
                </Box>
            </Paper>

            <ComposeMessage
                open={composeOpen}
                onClose={() => setComposeOpen(false)}
                onMessageSent={() => {
                    fetchMessages();
                    // Optionally select the partner we just messaged
                }}
            />
        </Container>
    );
};

export default Messages;
