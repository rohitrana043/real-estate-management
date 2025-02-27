package com.realestate.property.service;

import com.realestate.property.dto.FavoritePropertyDTO;
import com.realestate.property.dto.PropertyDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface FavoritePropertyService {

    /**
     * Add a property to user's favorites
     *
     * @param propertyId The ID of the property to favorite
     * @param userEmail The email of the user
     * @return The created favorite property
     */
    FavoritePropertyDTO.Simple addToFavorites(Long propertyId, String userEmail);

    /**
     * Remove a property from user's favorites
     *
     * @param propertyId The ID of the property to unfavorite
     * @param userEmail The email of the user
     */
    void removeFromFavorites(Long propertyId, String userEmail);

    /**
     * Get all favorite properties for a user
     *
     * @param userEmail The email of the user
     * @param pageable Pagination parameters
     * @return A page of favorite properties
     */
    Page<PropertyDTO> getFavoriteProperties(String userEmail, Pageable pageable);

    /**
     * Check if a property is favorited by a user
     *
     * @param propertyId The ID of the property
     * @param userEmail The email of the user
     * @return true if the property is favorited, false otherwise
     */
    boolean isFavorite(Long propertyId, String userEmail);

    /**
     * Get favorite count for a property
     *
     * @param propertyId The ID of the property
     * @return The number of users who favorited this property
     */
    long getFavoriteCount(Long propertyId);

    /**
     * Get all property IDs favorited by a user
     *
     * @param userEmail The email of the user
     * @return A set of property IDs
     */
    Set<Long> getFavoritedPropertyIds(String userEmail);

    /**
     * Get total number of favorites for a user
     *
     * @param userEmail The email of the user
     * @return The total count of favorites
     */
    long getTotalFavorites(String userEmail);
}