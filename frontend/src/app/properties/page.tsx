// src/app/properties/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
  InputBase,
  IconButton,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { useAuth } from '@/contexts/AuthContext';
import favoritesApi from '@/lib/api/favorites';
import PropertyCard from '@/components/properties/PropertyCard';
import { getProperties, searchProperties } from '@/lib/api/properties';
import {
  PropertyDTO,
  PropertySearchCriteria,
  PagePropertyDTO,
  SortOption,
  FilterState,
  DEFAULT_FILTERS,
  DEFAULT_PRICE_RANGE,
  PropertyType,
  PropertyStatus,
} from '@/types/property';
import { useSnackbar } from 'notistack';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchCriteria, setSearchCriteria] = useState<PropertySearchCriteria>(
    {}
  );
  const { enqueueSnackbar } = useSnackbar();
  const [favoritePropertyIds, setFavoritePropertyIds] = useState<Set<number>>(
    new Set()
  );

  // Filter state
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { user } = useAuth();

  // Price range slider
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000000]);
  // Add sorting state
  const [sortBy, setSortBy] = useState<string>('newest');

  // Define sort options
  const sortOptions: SortOption[] = [
    { label: 'Newest', value: 'newest', field: 'createdAt', direction: 'desc' },
    {
      label: 'Price (Low to High)',
      value: 'price_low',
      field: 'price',
      direction: 'asc',
    },
    {
      label: 'Price (High to Low)',
      value: 'price_high',
      field: 'price',
      direction: 'desc',
    },
  ];

  const clearFilters = () => {
    setSearchCriteria({});
    setPriceRange([0, 2000000]);
    setSearchTerm('');
    setSortBy('newest'); // Reset sort to default
    setPage(1);
    fetchProperties();
  };

  // Convert filters to search criteria
  const getSearchCriteria = (): PropertySearchCriteria => {
    return {
      keyword: searchTerm || undefined,
      type: filters.type !== 'all' ? (filters.type as PropertyType) : undefined,
      status:
        filters.status !== 'all'
          ? (filters.status as PropertyStatus)
          : undefined,
      minBedrooms:
        filters.bedrooms !== 'all' ? parseInt(filters.bedrooms) : undefined,
      minBathrooms:
        filters.bathrooms !== 'all' ? parseInt(filters.bathrooms) : undefined,
      minPrice:
        filters.priceRange[0] > DEFAULT_PRICE_RANGE[0]
          ? filters.priceRange[0]
          : undefined,
      maxPrice:
        filters.priceRange[1] < DEFAULT_PRICE_RANGE[1]
          ? filters.priceRange[1]
          : undefined,
    };
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    const newSortValue = event.target.value;
    setSortBy(newSortValue);
    setPage(1); // Reset to first page when sorting changes
  };

  // Fetch properties on page load and when pagination changes
  useEffect(() => {
    fetchProperties();
  }, [page, sortBy]);

  // Fetch favorite IDs when component mounts and user is logged in
  useEffect(() => {
    const fetchFavoriteIds = async () => {
      if (user) {
        try {
          const ids = await favoritesApi.getFavoriteIds();
          setFavoritePropertyIds(new Set(ids));
        } catch (error) {
          console.error('Error fetching favorite IDs:', error);
        }
      }
    };

    fetchFavoriteIds();
  }, [user]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      const selectedSort = sortOptions.find(
        (option) => option.value === sortBy
      );
      const sortQuery = selectedSort
        ? [`${selectedSort.field},${selectedSort.direction}`]
        : ['createdAt,desc'];

      const searchCriteria = getSearchCriteria();
      const hasActiveFilters = Object.values(searchCriteria).some(
        (value) => value !== undefined
      );

      let propertiesData: PagePropertyDTO;

      if (hasActiveFilters) {
        propertiesData = await searchProperties(
          searchCriteria,
          page - 1,
          10,
          sortQuery
        );
      } else {
        propertiesData = await getProperties(page - 1, 10, sortQuery);
      }

      setProperties(propertiesData.content);
      setTotalPages(Math.max(1, propertiesData.totalPages));
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
      enqueueSnackbar('Failed to load properties', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search form submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProperties();
  };

  // Handle filter changes
  const handleFilterChange = (
    field: keyof FilterState,
    value: string | number | [number, number]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    setPage(1); // Reset to first page
    fetchProperties();
    setShowFilters(false); // Optionally close the filter panel
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
    setPage(1);
    fetchProperties();
    setShowFilters(false);
  };

  const applyFilters = () => {
    // Reset to first page when applying filters
    setPage(1);

    // Create filter criteria
    const filters: PropertySearchCriteria = {
      ...searchCriteria,
      keyword: searchTerm || undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 2000000 ? priceRange[1] : undefined,
    };

    // Remove any undefined or null values
    Object.keys(filters).forEach((key) => {
      if (
        filters[key as keyof PropertySearchCriteria] === undefined ||
        filters[key as keyof PropertySearchCriteria] === null
      ) {
        delete filters[key as keyof PropertySearchCriteria];
      }
    });

    setSearchCriteria(filters);
    fetchProperties();
  };

  // Check if a property is favorited
  const isFavorite = (propertyId: number) => {
    return favoritePropertyIds.has(propertyId);
  };

  // Toggle favorite status for a property
  const handleToggleFavorite = async (propertyId: number) => {
    if (!user) {
      enqueueSnackbar('Please log in to save favorites', { variant: 'info' });
      return;
    }

    const isCurrentlyFavorite = favoritePropertyIds.has(propertyId);

    try {
      if (isCurrentlyFavorite) {
        await favoritesApi.removeFavorite(propertyId);
        setFavoritePropertyIds((prev) => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
        enqueueSnackbar('Removed from favorites', { variant: 'success' });
      } else {
        await favoritesApi.addFavorite(propertyId);
        setFavoritePropertyIds((prev) => new Set([...prev, propertyId]));
        enqueueSnackbar('Added to favorites', { variant: 'success' });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      enqueueSnackbar('Failed to update favorite status', { variant: 'error' });
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Explore Our Properties
        </Typography>
        {/* Search Bar */}
        <Paper
          component="form"
          elevation={2}
          sx={{ p: 2, mb: 4, borderRadius: 2 }}
          onSubmit={handleSearchSubmit}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search properties by location, title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="submit" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <Button
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              color="primary"
            >
              Filters
            </Button>
          </Box>

          {/* Filter Panel */}
          {showFilters && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                {/* Property Type Filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Property Type</InputLabel>
                    <Select
                      value={filters.type}
                      onChange={(e) =>
                        handleFilterChange('type', e.target.value)
                      }
                      label="Property Type"
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="APARTMENT">Apartment</MenuItem>
                      <MenuItem value="HOUSE">House</MenuItem>
                      <MenuItem value="COMMERCIAL">Commercial</MenuItem>
                      <MenuItem value="CONDO">Condo</MenuItem>
                      <MenuItem value="SPECIAL">Special</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Status Filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      onChange={(e) =>
                        handleFilterChange('status', e.target.value)
                      }
                      label="Status"
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="AVAILABLE">Available</MenuItem>
                      <MenuItem value="SOLD">Sold</MenuItem>
                      <MenuItem value="RENTED">Rented</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Bedrooms Filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Bedrooms</InputLabel>
                    <Select
                      value={filters.bedrooms}
                      onChange={(e) =>
                        handleFilterChange('bedrooms', e.target.value)
                      }
                      label="Bedrooms"
                    >
                      <MenuItem value="all">Any</MenuItem>
                      <MenuItem value="1">1+</MenuItem>
                      <MenuItem value="2">2+</MenuItem>
                      <MenuItem value="3">3+</MenuItem>
                      <MenuItem value="4">4+</MenuItem>
                      <MenuItem value="5">5+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Bathrooms Filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Bathrooms</InputLabel>
                    <Select
                      value={filters.bathrooms}
                      onChange={(e) =>
                        handleFilterChange('bathrooms', e.target.value)
                      }
                      label="Bathrooms"
                    >
                      <MenuItem value="all">Any</MenuItem>
                      <MenuItem value="1">1+</MenuItem>
                      <MenuItem value="2">2+</MenuItem>
                      <MenuItem value="3">3+</MenuItem>
                      <MenuItem value="4">4+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Price Range Filter */}
                <Grid item xs={12}>
                  <Typography gutterBottom>Price Range</Typography>
                  <Slider
                    value={filters.priceRange}
                    onChange={(_event, newValue) =>
                      handleFilterChange(
                        'priceRange',
                        newValue as [number, number]
                      )
                    }
                    valueLabelDisplay="auto"
                    min={DEFAULT_PRICE_RANGE[0]}
                    max={DEFAULT_PRICE_RANGE[1]}
                    step={50000}
                    valueLabelFormat={(value) => `$${value.toLocaleString()}`}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mt: 1,
                    }}
                  >
                    <Typography variant="body2">
                      ${filters.priceRange[0].toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      ${filters.priceRange[1].toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>

                {/* Filter Actions */}
                <Grid item xs={12}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}
                  >
                    <Button variant="outlined" onClick={handleClearFilters}>
                      Clear Filters
                    </Button>
                    <Button variant="contained" onClick={handleApplyFilters}>
                      Apply Filters
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Paper>

        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Loading indicator */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* No results message */}
            {properties.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No properties found
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search or filter criteria
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </Box>
            ) : (
              <>
                {/* Properties count */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="subtitle1" color="text.secondary">
                    Showing {properties.length} properties
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={handleSortChange}
                      label="Sort By"
                      startAdornment={
                        <SortIcon fontSize="small" sx={{ mr: 1 }} />
                      }
                    >
                      {sortOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                {/* Properties grid with favorite functionality */}
                <Grid container spacing={3}>
                  {properties.map((property) => (
                    <Grid item key={property.id} xs={12} sm={6} md={4}>
                      <PropertyCard
                        property={property}
                        isFavorite={
                          property.id ? isFavorite(property.id) : false
                        }
                        onToggleFavorite={handleToggleFavorite}
                      />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
}
