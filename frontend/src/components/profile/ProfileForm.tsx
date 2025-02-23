// src/components/profile/ProfileForm.tsx
'use client';

import { useState, useRef } from 'react';
import {
  Button,
  TextField,
  Typography,
  Paper,
  Avatar,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from 'notistack';
import styles from './ProfileForm.module.css';

interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  phone: yup
    .string()
    .matches(/^\+?[1-9][0-9]{7,14}$/, 'Invalid phone number format')
    .nullable()
    .optional(),
  address: yup.string().nullable().optional(),
});

export default function ProfileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateProfile } = useAuth();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar('Image is too large. Maximum size is 5MB', {
          variant: 'error',
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        enqueueSnackbar('Only image files are allowed', { variant: 'error' });
        return;
      }

      setSelectedImage(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare data for update
      const updateData: any = { ...data };

      // If a new image is selected, include it in the update
      if (selectedImage) {
        updateData.profilePicture = selectedImage;
      }

      // Update profile
      await updateProfile(updateData);

      enqueueSnackbar('Profile updated successfully', { variant: 'success' });

      // Clear selected image
      setSelectedImage(null);
    } catch (error) {
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Reset the form to original values
    reset({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    });
    // Clear selected image
    setSelectedImage(null);
  };

  return (
    <Paper className={styles.profileContainer} elevation={0}>
      <Typography variant="h5" component="h1" className={styles.title}>
        Profile Settings
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Profile update form"
      >
        <div className={styles.imageUploadContainer}>
          <Avatar
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : user?.profilePicture || undefined
            }
            className={styles.avatar}
            alt={`${user?.name}'s profile picture`}
          >
            {!user?.profilePicture && !selectedImage && user?.name.charAt(0)}
          </Avatar>
          <div>
            <input
              ref={fileInputRef}
              accept="image/*"
              className={styles.hiddenInput}
              id="profile-image-upload"
              type="file"
              onChange={handleImageChange}
              aria-label="Upload profile picture"
            />
            <label htmlFor="profile-image-upload">
              <IconButton
                color="primary"
                aria-label="Upload profile picture"
                component="span"
                onClick={handleAvatarClick}
                disabled={isSubmitting}
              >
                <PhotoCamera />
              </IconButton>
            </label>
            <Typography variant="body2" className={styles.uploadInfo}>
              Click to change profile picture (max 5MB)
            </Typography>
          </div>
        </div>

        <Divider className={styles.divider} />

        <div
          className={styles.formGrid}
          role="group"
          aria-label="Profile information"
        >
          <div className={styles.formField}>
            <label
              htmlFor="name"
              className={`${styles.label} ${styles.required}`}
            >
              Full Name
            </label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                  placeholder="Enter your full name"
                />
              )}
            />
          </div>

          <div className={styles.formField}>
            <label
              htmlFor="email"
              className={`${styles.label} ${styles.required}`}
            >
              Email Address
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isSubmitting}
                  placeholder="Enter your email address"
                />
              )}
            />
          </div>

          <div className={styles.formField}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="tel"
                  variant="outlined"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={isSubmitting}
                  placeholder="Enter your phone number"
                />
              )}
            />
          </div>

          <div className={`${styles.formField} ${styles.fullWidth}`}>
            <label htmlFor="address" className={styles.label}>
              Address
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={isSubmitting}
                  placeholder="Enter your address"
                />
              )}
            />
          </div>

          <div className={styles.buttonContainer}>
            <Button
              variant="outlined"
              disabled={isSubmitting}
              onClick={handleCancel}
              type="button"
              aria-label="Cancel changes"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              aria-label={isSubmitting ? 'Saving changes...' : 'Save changes'}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </Paper>
  );
}
