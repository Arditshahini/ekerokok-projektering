import { useState } from 'react'
import {
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation
} from '../../store/api/usersApi'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase-config'
import {
    CardContent,
    Button,
    TextField,
    Modal,
    IconButton,
    Card,
    Box,
    Chip,
    Stack,
    Divider,
    Typography
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'

export function UserList() {
    const { data, isLoading, refetch } = useGetUsersQuery({})
    const [deleteUser] = useDeleteUserMutation()
    const [updateUser] = useUpdateUserMutation()
    const [deletingUserId, setDeletingUserId] = useState(null)
    const [editingUserId, setEditingUserId] = useState(null)
    const [updatedUserData, setUpdatedUserData] = useState({
        clientName: '',
        clientInfo: '',
        workDescription: '',
        pictures: [],
        status: ''
    })
    const [openModal, setOpenModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)

    const handleDeleteUser = async (userId) => {
        try {
            setDeletingUserId(userId)
            await deleteUser({ userId })
            refetch()
        } catch (error) {
            console.error(`An error occurred while deleting: ${error.message}`)
        } finally {
            setDeletingUserId(null)
        }
    }

    const handleEditUser = (userId, user) => {
        setEditingUserId(userId)
        setUpdatedUserData(user)
    }

    const handleUpdateUser = async () => {
        try {
            await updateUser({
                userId: selectedUser.id,
                updatedData: updatedUserData
            })
            handleCloseModal()
            refetch()
        } catch (error) {
            console.error(`An error occurred while updating: ${error.message}`)
        }
    }

    const openImage = async (imagePath) => {
        try {
            const imageUrl = await getDownloadURL(ref(storage, imagePath))
            window.open(imageUrl)
        } catch (error) {
            console.error('Error fetching image:', error)
        }
    }

    const handleOpenModal = (user) => {
        setSelectedUser(user)
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    const renderModal = () => {
        if (!selectedUser) return null

        return (
            <Modal open={openModal} onClose={handleCloseModal}>
                <Card >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 600,
                            height: 600,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 5
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="div"
                            >
                                Översikt
                            </Typography>
                        </Stack>
                        <Stack>
                            <Typography
                                gutterBottom
                                variant="h6"
                                component="div"
                            >
                                Kundnamn: {selectedUser.clientName}
                            </Typography>
                        </Stack>
                        <Typography variant="body1" gutterBottom>
                            Adress: {selectedUser.clientInfo}
                        </Typography>

                        <Typography gutterBottom variant="body2">
                            Arbetsbeskrivning: {selectedUser.workDescription}
                        </Typography>
                        <Divider />
                        <Stack direction="row" spacing={1}>
                            <Chip
                                variant="outlined"
                                label="Bilder"
                                size="small"
                            />
                            <Chip
                                variant="outlined"
                                label="Filer"
                                size="small"
                            />
                            <Chip
                                variant="outlined"
                                label="Ändra"
                                size="small"
                            />
                        </Stack>
                    </Box>
                </Card>
            </Modal>
        )
    }

    const renderUserList = () => {
        if (isLoading) {
            return <Typography variant="body1">Loading users...</Typography>
        }

        if (!data || data.length === 0) {
            return (
                <div>
                    <Typography variant="body1">No data available.</Typography>
                    <Button variant="contained" onClick={refetch}>
                        Refresh
                    </Button>
                </div>
            )
        }

        return (
            <div>
                <Typography variant="h5">Projects:</Typography>
                {data.map((user) => (
                    <div
                        key={user.id}
                        style={{
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            onClick={() => handleEditUser(user.id, user)}
                            style={{ cursor: 'pointer', marginRight: '1rem' }}
                        >
                            {editingUserId === user.id ? (
                                <TextField
                                    value={updatedUserData.clientName}
                                    onChange={(e) =>
                                        setUpdatedUserData({
                                            ...updatedUserData,
                                            clientName: e.target.value
                                        })
                                    }
                                />
                            ) : (
                                user.clientName
                            )}
                        </Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleOpenModal(user)}
                        >
                            View Details
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deletingUserId === user.id}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
                <Button variant="outlined" size="small" onClick={refetch}>
                    Refresh
                </Button>
            </div>
        )
    }

    return (
        <div>
            {renderUserList()}
            {renderModal()}
        </div>
    )
}
