// src/app/dashboard/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  AdminPanelSettings as AdminIcon,
  AccountCircle as AgentIcon,
  Person as ClientIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useUsers } from '@/hooks/useUsers';
import { UserDTO } from '@/types/auth';
import { ROLES } from '@/utils/roleUtils';
import { withRoleProtection } from '@/components/auth/withRoleProtection';

// Role configuration for displaying role information
const roleConfig = {
  [ROLES.ADMIN]: {
    label: 'Administrator',
    color: 'error',
    icon: AdminIcon,
  },
  [ROLES.AGENT]: {
    label: 'Agent',
    color: 'primary',
    icon: AgentIcon,
  },
  [ROLES.CLIENT]: {
    label: 'Client',
    color: 'default',
    icon: ClientIcon,
  },
} as const;

function UsersManagementPage() {
  const router = useRouter();
  const { users, loading, error, totalUsers, fetchUsers, deleteUser } =
    useUsers();

  // Local state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserDTO | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>([]);

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filter users when search term, role filter, or users list changes
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.roles.includes(roleFilter));
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  // Role statistics
  const roleStats = {
    admins: users.filter((u) => u.roles.includes(ROLES.ADMIN)).length,
    agents: users.filter((u) => u.roles.includes(ROLES.AGENT)).length,
    clients: users.filter((u) => u.roles.includes(ROLES.CLIENT)).length,
  };

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle delete dialog
  const handleDeleteClick = (user: UserDTO) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      // Error handling is done by the hook
    }
  };

  // Loading state
  if (loading && !users.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => router.push('/dashboard/users/register')}
          >
            Add New User
          </Button>
        </Stack>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AdminIcon color="error" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="error.main">
                    {roleStats.admins}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Administrators
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <AgentIcon color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" color="primary.main">
                    {roleStats.agents}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Agents
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <ClientIcon color="action" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{roleStats.clients}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clients
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Role Filter</InputLabel>
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label="Role Filter"
              startAdornment={
                <InputAdornment position="start">
                  <FilterIcon />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value={ROLES.ADMIN}>Administrators</MenuItem>
              <MenuItem value={ROLES.AGENT}>Agents</MenuItem>
              <MenuItem value={ROLES.CLIENT}>Clients</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      {user.profilePicture ? (
                        <Box
                          component="img"
                          src={user.profilePicture}
                          alt=""
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <AgentIcon
                          sx={{ fontSize: 40, color: 'action.disabled' }}
                        />
                      )}
                      <Typography>{user.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.roles?.map((role) => {
                      const config =
                        roleConfig[role as keyof typeof roleConfig];
                      return (
                        <Chip
                          key={role}
                          label={config.label}
                          color={config.color as any}
                          size="small"
                          icon={<config.icon />}
                          sx={{ mr: 1 }}
                        />
                      );
                    })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.enabled ? 'Active' : 'Inactive'}
                      color={user.enabled ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() =>
                        router.push(`/dashboard/users/edit/${user.id}`)
                      }
                      color="primary"
                      title="Edit user"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(user)}
                      color="error"
                      title="Delete user"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 8 }}>
                  <Stack spacing={2} alignItems="center">
                    <Typography variant="h6" color="text.secondary">
                      No users found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm || roleFilter !== 'all'
                        ? 'Try adjusting your search filters'
                        : 'Start by adding some users to the system'}
                    </Typography>
                    {!searchTerm && roleFilter === 'all' && (
                      <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        onClick={() => router.push('/dashboard/users/register')}
                      >
                        Add First User
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm User Deletion</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Typography>
              Are you sure you want to delete the user{' '}
              <strong>{userToDelete?.name}</strong>? This action cannot be
              undone.
            </Typography>
            {userToDelete?.roles.includes(ROLES.ADMIN) && (
              <Alert severity="warning">
                Warning: You are about to delete an administrator account. Make
                sure there is at least one other admin account available.
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// Export with admin-only access protection
export default withRoleProtection(UsersManagementPage, [ROLES.ADMIN]);
