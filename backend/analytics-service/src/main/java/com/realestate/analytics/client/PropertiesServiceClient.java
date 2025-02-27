package com.realestate.analytics.client;

import com.realestate.analytics.config.RestTemplateConfig;
import com.realestate.analytics.dto.PropertyDTO;
import com.realestate.analytics.dto.PropertySearchCriteria;
import com.realestate.analytics.dto.PropertySearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class PropertiesServiceClient {

    private final RestTemplate restTemplate;

    @Value("${services.property.url}")
    private String propertyServiceUrl;

    /**
     * Fetch all properties with pagination
     */
    public PropertySearchResponse getAllProperties(int page, int size) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(propertyServiceUrl + "/api/properties")
                    .queryParam("page", page)
                    .queryParam("size", size)
                    .toUriString();

            ResponseEntity<PropertySearchResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(createHeaders()),
                    PropertySearchResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                log.error("Failed to fetch properties. Status: {}", response.getStatusCode());
                return new PropertySearchResponse();
            }
        } catch (Exception e) {
            log.error("Error fetching properties", e);
            return new PropertySearchResponse();
        }
    }

    /**
     * Search properties with specific criteria
     */
    public PropertySearchResponse searchProperties(PropertySearchCriteria criteria, int page, int size) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(propertyServiceUrl + "/api/properties/search")
                    .queryParam("page", page)
                    .queryParam("size", size)
                    .queryParam("criteria", criteria)
                    .toUriString();

            ResponseEntity<PropertySearchResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(createHeaders()),
                    PropertySearchResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                log.error("Failed to search properties. Status: {}", response.getStatusCode());
                return new PropertySearchResponse();
            }
        } catch (Exception e) {
            log.error("Error searching properties", e);
            return new PropertySearchResponse();
        }
    }

    /**
     * Get properties by city
     */
    public List<PropertyDTO> getPropertiesByCity(String city) {
        try {
            PropertySearchCriteria criteria = new PropertySearchCriteria();
            criteria.setCity(city);

            PropertySearchResponse response = searchProperties(criteria, 0, 1000);
            return response.getContent();
        } catch (Exception e) {
            log.error("Error fetching properties by city: {}", city, e);
            return Collections.emptyList();
        }
    }

    /**
     * Get properties by property type
     */
    public List<PropertyDTO> getPropertiesByType(String propertyType) {
        try {
            // First try to search with criteria
            PropertySearchCriteria criteria = new PropertySearchCriteria();
            criteria.setType(propertyType);

            PropertySearchResponse response = searchProperties(criteria, 0, 1000);

            // If that fails or returns empty, get all properties and filter in-memory
            if (response == null || response.getContent() == null || response.getContent().isEmpty()) {
                log.debug("No properties found using criteria search for type: {}. Trying alternative approach.", propertyType);

                PropertySearchResponse allResponse = getAllProperties(0, 1000);
                if (allResponse != null && allResponse.getContent() != null) {
                    return allResponse.getContent().stream()
                            .filter(p -> propertyType.equalsIgnoreCase(p.getType()))
                            .collect(Collectors.toList());
                }
            }

            return response.getContent();
        } catch (Exception e) {
            log.error("Error fetching properties by type: {}", propertyType, e);

            // Fallback - get all properties and filter manually
            try {
                PropertySearchResponse response = getAllProperties(0, 1000);
                if (response != null && response.getContent() != null) {
                    return response.getContent().stream()
                            .filter(p -> propertyType.equalsIgnoreCase(p.getType()))
                            .collect(Collectors.toList());
                }
            } catch (Exception ex) {
                log.error("Fallback failed for fetching properties by type", ex);
            }

            return Collections.emptyList();
        }
    }

    /**
     * Get properties by date range (created or updated)
     */
    public List<PropertyDTO> getPropertiesByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            PropertySearchCriteria criteria = new PropertySearchCriteria();
            criteria.setCreatedAfter(startDate);
            criteria.setCreatedBefore(endDate);

            PropertySearchResponse response = searchProperties(criteria, 0, 1000);
            return response.getContent();
        } catch (Exception e) {
            log.error("Error fetching properties by date range", e);
            return Collections.emptyList();
        }
    }

    /**
     * Get property by ID
     */
    public PropertyDTO getPropertyById(Long id) {
        try {
            String url = propertyServiceUrl + "/api/properties/" + id;
            ResponseEntity<PropertyDTO> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(createHeaders()),
                    PropertyDTO.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                log.error("Failed to fetch property with ID: {}. Status: {}", id, response.getStatusCode());
                return null;
            }
        } catch (Exception e) {
            log.error("Error fetching property with ID: {}", id, e);
            return null;
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        // Add authorization headers if needed
        // headers.set("Authorization", "Bearer " + jwtToken);
        return headers;
    }
}