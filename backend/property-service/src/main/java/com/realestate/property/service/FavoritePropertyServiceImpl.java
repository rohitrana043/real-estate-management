package com.realestate.property.service;

import com.realestate.property.dto.FavoritePropertyDTO;
import com.realestate.property.dto.PropertyDTO;
import com.realestate.property.exception.PropertyNotFoundException;
import com.realestate.property.mapper.PropertyMapper;
import com.realestate.property.model.FavoriteProperty;
import com.realestate.property.model.Property;
import com.realestate.property.repository.FavoritePropertyRepository;
import com.realestate.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class FavoritePropertyServiceImpl implements FavoritePropertyService {

    private final FavoritePropertyRepository favoriteRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyMapper propertyMapper;

    @Override
    @Transactional
    public FavoritePropertyDTO.Simple addToFavorites(Long propertyId, String userEmail) {
        log.info("Adding property id: {} to favorites for user: {}", propertyId, userEmail);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + propertyId));

        // Check if already favorited
        if (favoriteRepository.existsByPropertyAndUserEmail(property, userEmail)) {
            log.info("Property already in favorites for user: {}", userEmail);
            FavoriteProperty existing = favoriteRepository.findByPropertyAndUserEmail(property, userEmail)
                    .orElseThrow(); // Should not happen due to existsByPropertyAndUserEmail check

            return new FavoritePropertyDTO.Simple(
                    existing.getId(),
                    existing.getProperty().getId(),
                    existing.getUserEmail(),
                    existing.getCreatedAt()
            );
        }

        // Create new favorite
        FavoriteProperty favorite = new FavoriteProperty(property, userEmail);
        FavoriteProperty saved = favoriteRepository.save(favorite);

        log.info("Property id: {} added to favorites for user: {}", propertyId, userEmail);

        return new FavoritePropertyDTO.Simple(
                saved.getId(),
                saved.getProperty().getId(),
                saved.getUserEmail(),
                saved.getCreatedAt()
        );
    }

    @Override
    @Transactional
    public void removeFromFavorites(Long propertyId, String userEmail) {
        log.info("Removing property id: {} from favorites for user: {}", propertyId, userEmail);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + propertyId));

        favoriteRepository.deleteByPropertyAndUserEmail(property, userEmail);

        log.info("Property id: {} removed from favorites for user: {}", propertyId, userEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PropertyDTO> getFavoriteProperties(String userEmail, Pageable pageable) {
        log.info("Getting favorite properties for user: {}", userEmail);

        return favoriteRepository.findByUserEmail(userEmail, pageable)
                .map(favorite -> propertyMapper.toDTO(favorite.getProperty()));
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isFavorite(Long propertyId, String userEmail) {
        log.debug("Checking if property id: {} is favorited by user: {}", propertyId, userEmail);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + propertyId));

        return favoriteRepository.existsByPropertyAndUserEmail(property, userEmail);
    }

    @Override
    @Transactional(readOnly = true)
    public long getFavoriteCount(Long propertyId) {
        log.debug("Getting favorite count for property id: {}", propertyId);

        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + propertyId));

        return favoriteRepository.countByProperty(property);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<Long> getFavoritedPropertyIds(String userEmail) {
        log.debug("Getting favorited property IDs for user: {}", userEmail);

        return new HashSet<>(favoriteRepository.findFavoritedPropertyIdsByUserEmail(userEmail));
    }

    @Override
    @Transactional(readOnly = true)
    public long getTotalFavorites(String userEmail) {
        log.debug("Getting total favorites count for user: {}", userEmail);

        return favoriteRepository.countByUserEmail(userEmail);
    }
}