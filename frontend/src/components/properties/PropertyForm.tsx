// src/components/properties/PropertyForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Paper,
  Typography,
  Divider,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import {
  PropertyDTO,
  PropertyType,
  PropertyStatus,
  ImageDTO,
} from '@/types/property';
import { uploadImage, setMainImage, deleteImage } from '@/lib/api/properties';
import { useSnackbar } from 'notistack';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
// Note: You would need to install 'react-beautiful-dnd' package for the image reordering functionality
// Create a validation schema that matches PropertyDTO interface
const schema = yup.object().shape({
  title: yup
    .string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: yup
    .string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  type: yup
    .string()
    .required('Property type is required')
    .oneOf(
      ['APARTMENT', 'HOUSE', 'COMMERCIAL'],
      'Invalid property type'
    ) as yup.Schema<PropertyType>,
  status: yup
    .string()
    .required('Status is required')
    .oneOf(
      ['AVAILABLE', 'SOLD', 'RENTED'],
      'Invalid status'
    ) as yup.Schema<PropertyStatus>,
  price: yup
    .number()
    .required('Price is required')
    .min(0, 'Price must be a positive number'),
  bedrooms: yup
    .number()
    .required('Number of bedrooms is required')
    .min(0, 'Bedrooms must be a positive number'),
  bathrooms: yup
    .number()
    .required('Number of bathrooms is required')
    .min(0, 'Bathrooms must be a positive number'),
  area: yup
    .number()
    .required('Area is required')
    .min(0, 'Area must be a positive number'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zipCode: yup
    .string()
    .required('Zip code is required')
    .matches(/^\d{5}(-\d{4})?$/, 'Invalid zip code format'),
  // Add optional fields that exist in PropertyDTO but aren't required in the form
  id: yup.number().optional(),
  images: yup.array().optional(),
}) as yup.ObjectSchema<PropertyDTO>;

interface PropertyFormProps {
  initialData?: PropertyDTO;
  onSubmit: (data: PropertyDTO) => Promise<PropertyDTO | undefined>;
  isLoading?: boolean;
}

const PropertyForm = ({
  initialData,
  onSubmit,
  isLoading = false,
}: PropertyFormProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const [images, setImages] = useState<ImageDTO[]>(initialData?.images || []);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Initialize form with default values or existing property data
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PropertyDTO>({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      title: '',
      description: '',
      type: 'HOUSE' as PropertyType,
      status: 'AVAILABLE' as PropertyStatus,
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setImages(initialData.images || []);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: PropertyDTO) => {
    try {
      // Include images in the submitted data
      const dataWithImages: PropertyDTO = {
        ...data,
        images: images,
      };

      // Call the onSubmit function passed from parent
      const result = await onSubmit(dataWithImages);

      if (result) {
        enqueueSnackbar('Property saved successfully', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error saving property:', error);
      enqueueSnackbar('Failed to save property', { variant: 'error' });
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (
      !event.target.files ||
      event.target.files.length === 0 ||
      !initialData?.id
    ) {
      return;
    }

    const files = Array.from(event.target.files);
    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload one file at a time with progress tracking
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedImage = await uploadImage(initialData.id, file);

        setImages((prev) => [...prev, uploadedImage]);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      enqueueSnackbar(`${files.length} images uploaded successfully`, {
        variant: 'success',
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      enqueueSnackbar('Failed to upload images', { variant: 'error' });
    } finally {
      setUploading(false);
      setUploadProgress(0);

      // Clear the input
      event.target.value = '';
    }
  };

  const handleSetMainImage = async (imageId: number) => {
    if (!initialData?.id) return;

    try {
      const updatedImage = await setMainImage(initialData.id, imageId);

      // Update the local images state
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isMain: img.id === imageId,
        }))
      );

      enqueueSnackbar('Main image updated', { variant: 'success' });
    } catch (error) {
      console.error('Error setting main image:', error);
      enqueueSnackbar('Failed to set main image', { variant: 'error' });
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!initialData?.id) return;

    try {
      await deleteImage(initialData.id, imageId);

      // Remove the image from local state
      setImages((prev) => prev.filter((img) => img.id !== imageId));

      enqueueSnackbar('Image deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting image:', error);
      enqueueSnackbar('Failed to delete image', { variant: 'error' });
    }
  };

  const handleImagesReorder = (result: DropResult) => {
    // Skip if dropped outside the list
    if (!result.destination) return;

    // Skip if position didn't change
    if (result.destination.index === result.source.index) return;

    // Reorder the images array
    const reorderedImages = Array.from(images);
    const [removed] = reorderedImages.splice(result.source.index, 1);
    reorderedImages.splice(result.destination.index, 0, removed);

    // Update display order
    const updatedImages = reorderedImages.map((img, index) => ({
      ...img,
      displayOrder: index,
    }));

    setImages(updatedImages);

    // In a real application, you would then call an API to persist this order
    // reorderImages(initialData.id, updatedImages.map(img => img.id))
  };

  // Render the form
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'neutral.main',
      }}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
          {initialData ? 'Edit Property' : 'Add New Property'}
        </Typography>

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Property Title"
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  placeholder="Enter a descriptive title for your property"
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Property Type</InputLabel>
                  <Select {...field} label="Property Type">
                    <MenuItem value="APARTMENT">Apartment</MenuItem>
                    <MenuItem value="HOUSE">House</MenuItem>
                    <MenuItem value="COMMERCIAL">Commercial</MenuItem>
                  </Select>
                  <FormHelperText>{errors.type?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="AVAILABLE">Available</MenuItem>
                    <MenuItem value="SOLD">Sold</MenuItem>
                    <MenuItem value="RENTED">Rented</MenuItem>
                  </Select>
                  <FormHelperText>{errors.status?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  placeholder="Provide a detailed description of the property"
                />
              )}
            />
          </Grid>

          {/* Property Details */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" sx={{ my: 2, fontWeight: 600 }}>
              Property Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Price ($)"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="bedrooms"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Bedrooms"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  error={!!errors.bedrooms}
                  helperText={errors.bedrooms?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="bathrooms"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Bathrooms"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  error={!!errors.bathrooms}
                  helperText={errors.bathrooms?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="area"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Area (sq ft)"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  error={!!errors.area}
                  helperText={errors.area?.message}
                />
              )}
            />
          </Grid>

          {/* Location Information */}
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" sx={{ my: 2, fontWeight: 600 }}>
              Location
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Address"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="City"
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="State"
                  error={!!errors.state}
                  helperText={errors.state?.message}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <Controller
              name="zipCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Zip Code"
                  error={!!errors.zipCode}
                  helperText={errors.zipCode?.message}
                />
              )}
            />
          </Grid>

          {/* Property Images - Only show if editing an existing property */}
          {initialData?.id && (
            <>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" sx={{ my: 2, fontWeight: 600 }}>
                  Property Images
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading}
                  >
                    Upload Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      hidden
                      onChange={handleImageUpload}
                    />
                  </Button>
                </Box>

                {uploading && (
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <CircularProgress
                      variant="determinate"
                      value={uploadProgress}
                    />
                    <Typography variant="caption" sx={{ ml: 2 }}>
                      Uploading... {Math.round(uploadProgress)}%
                    </Typography>
                  </Box>
                )}

                {images.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No images uploaded yet
                  </Typography>
                ) : (
                  <DragDropContext onDragEnd={handleImagesReorder}>
                    <Droppable droppableId="property-images">
                      {(
                        provided: import('react-beautiful-dnd').DroppableProvided
                      ) => (
                        <Box
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          sx={{ mt: 2 }}
                        >
                          <Grid container spacing={2}>
                            {images.map((image, index) => (
                              <Draggable
                                key={image.id.toString()}
                                draggableId={image.id.toString()}
                                index={index}
                              >
                                {(
                                  provided: import('react-beautiful-dnd').DraggableProvided
                                ) => (
                                  <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <Paper
                                      elevation={0}
                                      sx={{
                                        p: 1,
                                        border: '1px solid',
                                        borderColor: image.isMain
                                          ? 'primary.main'
                                          : 'neutral.main',
                                        borderRadius: 2,
                                        position: 'relative',
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          width: '100%',
                                          height: 150,
                                          backgroundImage: `url(${image.url})`,
                                          backgroundSize: 'cover',
                                          backgroundPosition: 'center',
                                          borderRadius: 1,
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          mt: 1,
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                        }}
                                      >
                                        <Box
                                          {...provided.dragHandleProps}
                                          sx={{ cursor: 'move' }}
                                        >
                                          <DragIndicatorIcon
                                            color="action"
                                            fontSize="small"
                                          />
                                        </Box>
                                        <Box>
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleSetMainImage(image.id)
                                            }
                                            color={
                                              image.isMain
                                                ? 'primary'
                                                : 'default'
                                            }
                                            title={
                                              image.isMain
                                                ? 'Main image'
                                                : 'Set as main image'
                                            }
                                          >
                                            {image.isMain ? (
                                              <StarIcon />
                                            ) : (
                                              <StarBorderIcon />
                                            )}
                                          </IconButton>
                                          <IconButton
                                            size="small"
                                            onClick={() =>
                                              handleDeleteImage(image.id)
                                            }
                                            color="error"
                                            title="Delete image"
                                          >
                                            <DeleteIcon />
                                          </IconButton>
                                        </Box>
                                      </Box>
                                    </Paper>
                                  </Grid>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </Grid>
                        </Box>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </Grid>
            </>
          )}

          {/* Submit Button */}
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" type="button" onClick={() => reset()}>
                Reset
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isLoading
                  ? 'Saving...'
                  : initialData
                  ? 'Update Property'
                  : 'Add Property'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PropertyForm;
