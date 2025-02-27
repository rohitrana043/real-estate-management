package com.realestate.property.repository;

import com.realestate.property.model.FavoriteProperty;
import com.realestate.property.model.Property;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoritePropertyRepository extends JpaRepository<FavoriteProperty, Long> {

    /**
     * Find all favorites for a specific user
     */
    List<FavoriteProperty> findByUserEmail(String userEmail);

    /**
     * Find all favorites for a specific user with pagination
     */
    Page<FavoriteProperty> findByUserEmail(String userEmail, Pageable pageable);

    /**
     * Find a specific favorite by property and user email
     */
    Optional<FavoriteProperty> findByPropertyAndUserEmail(Property property, String userEmail);

    /**
     * Check if a property is favorited by a user
     */
    boolean existsByPropertyAndUserEmail(Property property, String userEmail);

    /**
     * Delete a favorite by property and user email
     */
    void deleteByPropertyAndUserEmail(Property property, String userEmail);

    /**
     * Count favorites by property
     */
    long countByProperty(Property property);

    /**
     * Get total favorites count for a user
     */
    long countByUserEmail(String userEmail);

    /**
     * Custom query to get properties with favorite status for a user
     */
    @Query("SELECT p.id FROM FavoriteProperty f JOIN f.property p WHERE f.userEmail = ?1")
    List<Long> findFavoritedPropertyIdsByUserEmail(String userEmail);
}