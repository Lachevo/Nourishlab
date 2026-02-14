import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    Link,
    CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import api from '../services/api';
import type { LabResult } from '../types';

const LabResultsPage: React.FC = () => {
    const [results, setResults] = useState<LabResult[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await api.get('/lab-results/');
            setResults(response.data);
        } catch (error) {
            console.error("Failed to fetch lab results", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const handleSubmit = async () => {
        if (!file || !title) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('file', file);

        try {
            await api.post('/lab-results/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setOpenDialog(false);
            resetForm();
            fetchResults();
        } catch (error) {
            console.error("Failed to upload info", error);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    if (loading) return (
        <Container sx={{ mt: 8, textAlign: 'center' }}>
            <CircularProgress />
            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 }}>Loading your documents...</Typography>
        </Container>
    );

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight={800}>Lab Results & Documents</Typography>
                <Button
                    variant="contained"
                    startIcon={<UploadFileIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    Upload Document
                </Button>
            </Box>

            <List>
                {results.map((result) => (
                    <Card key={result.id} sx={{ mb: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <InsertDriveFileIcon color="action" sx={{ mr: 2, fontSize: 40 }} />
                                    <Box>
                                        <Typography variant="h6" component="div" fontWeight={700}>
                                            {result.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Uploaded on {new Date(result.uploaded_at).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                                            {result.description}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    component={Link}
                                    href={result.file}
                                    target="_blank"
                                    startIcon={<DownloadIcon />}
                                    variant="outlined"
                                    sx={{ borderRadius: 2 }}
                                >
                                    View
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
                {results.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography color="text.secondary">No documents uploaded yet.</Typography>
                    </Box>
                )}
            </List>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Title"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Description (Optional)"
                                multiline
                                rows={2}
                                fullWidth
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                startIcon={<UploadFileIcon />}
                            >
                                Select File
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleFileChange}
                                />
                            </Button>
                            {file && <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Selected: {file.name}</Typography>}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={!file || !title}>Upload</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default LabResultsPage;
