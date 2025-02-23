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
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import Navbar from '@/components/layout/Navbar';
import PropertyCard from '@/components/properties/PropertyCard';
import { getProperties, searchProperties } from '@/lib/api/properties';
import {
  PropertyDTO,
  PropertySearchCriteria,
  PagePropertyDTO,
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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchCriteria, setSearchCriteria] = useState<PropertySearchCriteria>(
    {}
  );
  const { enqueueSnackbar } = useSnackbar();

  // Price range slider
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000000]);

  // Fetch properties on page load and when pagination changes
  useEffect(() => {
    fetchProperties();
  }, [page]);

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      let propertiesData: PagePropertyDTO;

      // If there are search criteria or search term, use search API
      if (searchTerm || Object.keys(searchCriteria).length > 0) {
        // Add search term to search criteria
        const criteria: PropertySearchCriteria = {
          ...searchCriteria,
          keyword: searchTerm || undefined,
          minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
          maxPrice: priceRange[1] < 2000000 ? priceRange[1] : undefined,
        };

        propertiesData = await searchProperties(criteria, page - 1);
      } else {
        propertiesData = await getProperties(page - 1);
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    fetchProperties();
  };

  const handleFilterChange = (
    key: keyof PropertySearchCriteria,
    value: any
  ) => {
    setSearchCriteria((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
  };

  const clearFilters = () => {
    setSearchCriteria({});
    setPriceRange([0, 2000000]);
    setSearchTerm('');
    setPage(1);
    fetchProperties();
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
          Explore Our Properties
        </Typography>

        {/* Search and Filter Bar */}
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

          {/* Filter options */}
          {showFilters && (
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Property Type</InputLabel>
                    <Select
                      value={searchCriteria.type || 'all'}
                      onChange={(e) =>
                        handleFilterChange('type', e.target.value)
                      }
                      label="Property Type"
                    >
                      <MenuItem value="all">All Types</MenuItem>
                      <MenuItem value="APARTMENT">Apartment</MenuItem>
                      <MenuItem value="HOUSE">House</MenuItem>
                      <MenuItem value="COMMERCIAL">Commercial</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={searchCriteria.status || 'all'}
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
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Bedrooms</InputLabel>
                    <Select
                      value={searchCriteria.minBedrooms || 'all'}
                      onChange={(e) =>
                        handleFilterChange('minBedrooms', e.target.value)
                      }
                      label="Bedrooms"
                    >
                      <MenuItem value="all">Any</MenuItem>
                      <MenuItem value={1}>1+</MenuItem>
                      <MenuItem value={2}>2+</MenuItem>
                      <MenuItem value={3}>3+</MenuItem>
                      <MenuItem value={4}>4+</MenuItem>
                      <MenuItem value={5}>5+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Bathrooms</InputLabel>
                    <Select
                      value={searchCriteria.minBathrooms || 'all'}
                      onChange={(e) =>
                        handleFilterChange('minBathrooms', e.target.value)
                      }
                      label="Bathrooms"
                    >
                      <MenuItem value="all">Any</MenuItem>
                      <MenuItem value={1}>1+</MenuItem>
                      <MenuItem value={2}>2+</MenuItem>
                      <MenuItem value={3}>3+</MenuItem>
                      <MenuItem value={4}>4+</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Typography id="price-range-slider" gutterBottom>
                    Price Range
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(_event, newValue: number | number[]) =>
                      setPriceRange(newValue as number[])
                    }
                    valueLabelDisplay="auto"
                    min={0}
                    max={2000000}
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
                      ${priceRange[0].toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      ${priceRange[1].toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}
                  >
                    <Button variant="outlined" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setPage(1);
                        fetchProperties();
                      }}
                    >
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
                      value="newest"
                      onChange={() => {}}
                      label="Sort By"
                      startAdornment={
                        <SortIcon fontSize="small" sx={{ mr: 1 }} />
                      }
                    >
                      <MenuItem value="newest">Newest</MenuItem>
                      <MenuItem value="price_low">Price (Low to High)</MenuItem>
                      <MenuItem value="price_high">
                        Price (High to Low)
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Properties grid */}
                <Grid container spacing={3}>
                  {properties.map((property) => (
                    <Grid item key={property.id} xs={12} sm={6} md={4}>
                      <PropertyCard property={property} />
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
