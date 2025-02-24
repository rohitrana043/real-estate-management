// src/components/users/UserForm.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Stack,
  Tooltip,
  styled,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { UserDTO } from '@/types/auth';
import { ROLES } from '@/utils/roleUtils';
import { useRoles } from '@/hooks/useRoles';
import { FormInputs, UserRole, UserSubmitData } from '@/types/userForm';
import { createValidationSchema } from '@/lib/validation/userForm';

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[1],
}));

interface UserFormProps {
  user?: UserDTO;
  onSubmit: (data: UserSubmitData) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
}

export default function UserForm({
  user,
  onSubmit,
  isLoading = false,
  onCancel,
}: UserFormProps) {
  const isNewUser = !user;
  const { isAdmin } = useRoles();
  const { enqueueSnackbar } = useSnackbar();
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profilePicture || null
  );

  // Form setup with validation
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<FormInputs>({
    resolver: yupResolver<FormInputs>(createValidationSchema(isNewUser)),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || null,
      roles: user?.roles || [ROLES.CLIENT], // Default to CLIENT role
      address: user?.address || null,
      enabled: user?.enabled ?? true,
      password: null,
      confirmPassword: null,
      profilePicture: null,
    },
  });

  // Reset form when user prop changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        roles: user?.roles || [ROLES.CLIENT], // Default to CLIENT role
        address: user.address || null,
        enabled: user.enabled ?? true,
        password: null,
        confirmPassword: null,
        profilePicture: null,
      });
      setProfileImage(user.profilePicture || null);
    }
  }, [user, reset]);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar('Image size should not exceed 5MB', {
          variant: 'error',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setProfileImage(dataUrl);
        setValue('profilePicture', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: FormInputs) => {
    try {
      // Remove confirmPassword before submitting
      const { confirmPassword, ...submitData } = data;

      // Create a new object without password if it's null
      const finalData = {
        ...submitData,
        ...(submitData.password === null && { password: undefined }),
      };

      await onSubmit(submitData);
      enqueueSnackbar(
        `User successfully ${isNewUser ? 'created' : 'updated'}`,
        { variant: 'success' }
      );

      if (isNewUser) {
        reset();
        setProfileImage(null);
      }
    } catch (error: any) {
      enqueueSnackbar(error.message || 'An error occurred', {
        variant: 'error',
      });
    }
  };

  // Watch password field for validation
  const password = watch('password');

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      noValidate
      sx={{ width: '100%' }}
    >
      <Grid container spacing={3}>
        {/* Profile Picture */}
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <ProfileAvatar
              src={profileImage || ''}
              alt="User profile picture"
            />
            <Tooltip title="Upload profile picture">
              <label htmlFor="profile-picture-input">
                <VisuallyHiddenInput
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  aria-label="Upload profile picture"
                />
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  <PhotoCameraIcon sx={{ color: 'white' }} />
                </IconButton>
              </label>
            </Tooltip>
            {profileImage && (
              <Tooltip title="Remove profile picture">
                <IconButton
                  onClick={() => {
                    setProfileImage(null);
                    setValue('profilePicture', null);
                  }}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    bgcolor: 'error.main',
                    '&:hover': { bgcolor: 'error.dark' },
                  }}
                  aria-label="Remove profile picture"
                >
                  <DeleteIcon sx={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Grid>

        {/* Basic Information */}
        <Grid item xs={12} md={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Name"
                error={!!errors.name}
                helperText={errors.name?.message}
                inputProps={{ 'aria-label': 'User name' }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                inputProps={{ 'aria-label': 'User email' }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="phone"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <TextField
                {...field}
                value={value || ''}
                onChange={(e) => onChange(e.target.value || null)}
                fullWidth
                label="Phone"
                error={!!errors.phone}
                helperText={errors.phone?.message || 'Format: +1234567890'}
                inputProps={{ 'aria-label': 'User phone number' }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="roles"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.roles}>
                <InputLabel id="roles-select-label">Roles</InputLabel>
                <Select
                  {...field}
                  labelId="roles-select-label"
                  label="Roles"
                  disabled={!isAdmin}
                  value={field.value[0] || ''} // Show first role in select
                  onChange={(e) => field.onChange([e.target.value])} // Store as array
                  inputProps={{ 'aria-label': 'User roles' }}
                >
                  <MenuItem value={ROLES.ADMIN}>Administrator</MenuItem>
                  <MenuItem value={ROLES.AGENT}>Agent</MenuItem>
                  <MenuItem value={ROLES.CLIENT}>Client</MenuItem>
                </Select>
                {errors.roles && (
                  <FormHelperText>{errors.roles.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="address"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <TextField
                {...field}
                value={value || ''}
                onChange={(e) => onChange(e.target.value || null)}
                fullWidth
                label="Address"
                multiline
                rows={2}
                error={!!errors.address}
                helperText={errors.address?.message}
                inputProps={{ 'aria-label': 'User address' }}
              />
            )}
          />
        </Grid>

        {/* Password Fields */}
        {(isNewUser || watch('password')) && (
          <>
            <Grid item xs={12} md={6}>
              <Controller
                name="password"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <TextField
                    {...field}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value || null)}
                    fullWidth
                    type="password"
                    label={isNewUser ? 'Password' : 'New Password'}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    inputProps={{ 'aria-label': 'User password' }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <TextField
                    {...field}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value || null)}
                    fullWidth
                    type="password"
                    label="Confirm Password"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    inputProps={{ 'aria-label': 'Confirm password' }}
                  />
                )}
              />
            </Grid>
          </>
        )}

        {/* Account Status */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Controller
            name="enabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={!isAdmin}
                    inputProps={{ 'aria-label': 'User account status' }}
                  />
                }
                label={
                  <Typography
                    color={field.value ? 'success.main' : 'text.secondary'}
                  >
                    User Account {field.value ? 'Active' : 'Inactive'}
                  </Typography>
                }
              />
            )}
          />
        </Grid>

        {/* Form Actions */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => {
                if (onCancel) {
                  onCancel();
                } else {
                  reset();
                }
              }}
              disabled={isLoading}
              startIcon={<CloseIcon />}
              aria-label="Cancel form"
            >
              Cancel
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isLoading}
              disabled={!isDirty}
              startIcon={<SaveIcon />}
              aria-label={isNewUser ? 'Create user' : 'Save changes'}
            >
              {isNewUser ? 'Create User' : 'Save Changes'}
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
