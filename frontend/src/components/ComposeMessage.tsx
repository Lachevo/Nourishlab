
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Autocomplete,
    Box,
    Avatar,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import { Send } from '@mui/icons-material';
import api from '../services/api';
import type { User } from '../types';

interface ComposeMessageProps {
    open: boolean;
    onClose: () => void;
    onMessageSent: () => void;
    initialRecipient?: User | null;
}

const ComposeMessage: React.FC<ComposeMessageProps> = ({ open, onClose, onMessageSent, initialRecipient }) => {
    const [recipients, setRecipients] = useState<User[]>([]);
    const [selectedRecipient, setSelectedRecipient] = useState<User | null>(initialRecipient || null);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            fetchRecipients();
            if (initialRecipient) {
                setSelectedRecipient(initialRecipient);
            }
        }
    }, [open, initialRecipient]);

    const fetchRecipients = async () => {
        try {
            setLoading(true);
            // If nutritionist, fetch patients. If patient, fetch nutritionist.
            // We can determine this by checking profile or trying both endpoints.
            // For simplicity, let's assume the API returns relevant contacts.
            // A better approach is to have a dedicated 'contacts' endpoint.

            // Try fetching patients (for nutritionist)
            try {
                const patientsRes = await api.get('/nutritionist/patients/');
                setRecipients(patientsRes.data);
            } catch (e) {
                // If 403, might be a patient, try fetching nutritionist
                try {
                    const nutritionistsRes = await api.get('/nutritionists/');
                    setRecipients(nutritionistsRes.data);
                } catch (e2) {
                    console.error("Could not fetch recipients");
                }
            }
        } catch (err: any) {
            console.error('Failed to load recipients', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!selectedRecipient || !content) {
            setError('Please select a recipient and write a message');
            return;
        }

        try {
            setSending(true);
            setError('');
            await api.post('/messages/', {
                recipient: selectedRecipient.username,
                subject,
                content
            });
            onMessageSent();
            handleClose();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleClose = () => {
        setSubject('');
        setContent('');
        setSelectedRecipient(null);
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>New Message</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <Autocomplete
                        options={recipients}
                        loading={loading}
                        value={selectedRecipient}
                        onChange={(_, newValue) => setSelectedRecipient(newValue)}
                        getOptionLabel={(option) => option.username}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="To"
                                placeholder="Select recipient"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <Box component="li" {...props} key={option.id}>
                                <Avatar sx={{ mr: 2, width: 24, height: 24, fontSize: 12 }}>
                                    {(option.username || '?').charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="body2">
                                    {option.username}
                                    {option.email && <Typography component="span" variant="caption" color="text.secondary" ml={1}>({option.email})</Typography>}
                                </Typography>
                            </Box>
                        )}
                    />

                    <TextField
                        label="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Message"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        rows={6}
                        fullWidth
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    onClick={handleSend}
                    variant="contained"
                    endIcon={<Send />}
                    disabled={sending || !selectedRecipient || !content}
                >
                    {sending ? 'Sending...' : 'Send'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ComposeMessage;
