// ImageService.java
package com.realestate.property.service;

import com.realestate.property.dto.ImageDTO;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ImageService {
    ImageDTO uploadImage(Long propertyId, MultipartFile file);
    List<ImageDTO> getPropertyImages(Long propertyId);
    void deleteImage(Long imageId);
    ImageDTO getImage(Long imageId);
    List<ImageDTO> uploadMultipleImages(Long propertyId, List<MultipartFile> files);
    void deleteAllPropertyImages(Long propertyId);
    ImageDTO updateImage(Long imageId, MultipartFile file);
    ImageDTO setMainImage(Long propertyId, Long imageId);
    List<ImageDTO> reorderImages(Long propertyId, List<Long> imageIds);
    byte[] downloadImage(Long imageId);
}