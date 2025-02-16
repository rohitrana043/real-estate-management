package com.realestate.property.repository;

import com.realestate.property.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByPropertyId(Long propertyId);
}