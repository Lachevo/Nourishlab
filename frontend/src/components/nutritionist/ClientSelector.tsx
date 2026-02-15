import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    InputAdornment,
    Avatar,
    Typography,
    Chip,
    CircularProgress,
    Alert,
    Autocomplete,
    Grid
} from '@mui/material';
import { Search, Person, CheckCircle, Pending } from '@mui/icons-material';
import api from '../../services/api';
import type { User } from '../../types';

interface ClientSelectorProps {
    onClientSelect: (clientId: number | null) => void;
    selectedClientId?: number | null;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({ onClientSelect, selectedClientId }) => {
    const [clients, setClients] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedClient, setSelectedClient] = useState<User | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        if (selectedClientId && clients.length > 0) {
            const client = clients.find(c => c.id === selectedClientId);
            setSelectedClient(client || null);
        }
    }, [selectedClientId, clients]);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await api.get('/nutritionist/patients/');
            setClients(response.data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load clients');
        } finally {
            setLoading(false);
        }
    };

    const handleClientChange = (_event: any, newValue: User | null) => {
        setSelectedClient(newValue);
        onClientSelect(newValue?.id || null);
    };

    if (loading) {
        return (
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box display="flex" justifyContent="center" alignItems="center" py={2}>
                        <CircularProgress size={30} />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                            Loading clients...
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 3 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Select Client
                </Typography>

                <Autocomplete
                    options={clients}
                    value={selectedClient}
                    onChange={handleClientChange}
                    getOptionLabel={(option) => option.username}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Search and select a client..."
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                    renderOption={(props, option) => (
                        <Box component="li" {...props} key={option.id}>
                            <Box display="flex" alignItems="center" width="100%" gap={2}>
                                <Avatar
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        fontSize: 16,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {option.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box flex={1}>
                                    <Typography variant="body1" fontWeight={600}>
                                        {option.username}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {option.email}
                                    </Typography>
                                </Box>
                                {option.profile?.is_approved ? (
                                    <Chip
                                        icon={<CheckCircle />}
                                        label="Active"
                                        color="success"
                                        size="small"
                                    />
                                ) : (
                                    <Chip
                                        icon={<Pending />}
                                        label="Pending"
                                        color="warning"
                                        size="small"
                                    />
                                )}
                            </Box>
                        </Box>
                    )}
                    noOptionsText="No clients found"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        }
                    }}
                />

                {selectedClient && (
                    <Box mt={3} p={2} sx={{ backgroundColor: 'action.hover', borderRadius: 2 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Selected Client
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                    {selectedClient.username}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Email
                                </Typography>
                                <Typography variant="body1">
                                    {selectedClient.email}
                                </Typography>
                            </Grid>
                            {selectedClient.profile?.goals && (
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Goals
                                    </Typography>
                                    <Typography variant="body2">
                                        {selectedClient.profile.goals}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}

                {!selectedClient && (
                    <Box mt={2} textAlign="center" py={2}>
                        <Person sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                            Select a client to view their data
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default ClientSelector;
