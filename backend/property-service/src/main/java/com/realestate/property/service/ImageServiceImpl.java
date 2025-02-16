package com.realestate.property.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.*;
import com.realestate.property.dto.ImageDTO;
import com.realestate.property.exception.ImageNotFoundException;
import com.realestate.property.exception.ImageUploadException;
import com.realestate.property.exception.PropertyNotFoundException;
import com.realestate.property.mapper.ImageMapper;
import com.realestate.property.model.Image;
import com.realestate.property.model.Property;
import com.realestate.property.repository.ImageRepository;
import com.realestate.property.repository.PropertyRepository;
import com.realestate.property.util.ImageServiceUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final AmazonS3 amazonS3;
    private final ImageRepository imageRepository;
    private final PropertyRepository propertyRepository;
    private final ImageMapper imageMapper;

    @Value("${aws.s3.bucket.name}")
    private String bucketName;

    @Override
    @Transactional
    public ImageDTO uploadImage(Long propertyId, MultipartFile file) {
        try {
            // Validate property exists
            Property property = propertyRepository.findById(propertyId)
                    .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + propertyId));

            // Validate image
            ImageServiceUtils.validateImage(file);

            // Generate unique file name
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Generate S3 key
            String s3Key = ImageServiceUtils.generateS3Key(propertyId, fileName);

            // Upload to S3
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            try {
                amazonS3.putObject(new PutObjectRequest(
                        bucketName,
                        s3Key,
                        file.getInputStream(),
                        metadata
                ));
            } catch (AmazonS3Exception e) {
                log.error("Failed to upload file to S3: {}", e.getMessage());
                throw new ImageUploadException("Failed to upload image to storage: " + e.getMessage());
            }

            // Generate S3 URL
            String fileUrl = amazonS3.getUrl(bucketName, s3Key).toString();

            // Save image metadata to database
            Image image = new Image();
            image.setName(fileName);
            image.setType(file.getContentType());
            image.setUrl(fileUrl);
            image.setProperty(property);

            Image savedImage = imageRepository.save(image);
            return imageMapper.toDTO(savedImage);

        } catch (IOException e) {
            log.error("Error processing image upload: ", e);
            throw new ImageUploadException("Failed to process image upload: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImageDTO> getPropertyImages(Long propertyId) {
        if (!propertyRepository.existsById(propertyId)) {
            throw new PropertyNotFoundException("Property not found with id: " + propertyId);
        }

        List<Image> images = imageRepository.findByPropertyId(propertyId);
        return images.stream()
                .map(imageMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteImage(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ImageNotFoundException("Image not found with id: " + imageId));

        try {
            // Extract S3 key from URL
            String fileUrl = image.getUrl();
            String s3Key = fileUrl.substring(fileUrl.indexOf(bucketName) + bucketName.length() + 1);

            // Delete from S3
            amazonS3.deleteObject(bucketName, s3Key);

            // Delete from database
            imageRepository.delete(image);
        } catch (AmazonS3Exception e) {
            log.error("Failed to delete image from S3: {}", e.getMessage());
            throw new ImageUploadException("Failed to delete image from storage: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public ImageDTO getImage(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ImageNotFoundException("Image not found with id: " + imageId));
        return imageMapper.toDTO(image);
    }

    @Override
    @Transactional
    public List<ImageDTO> uploadMultipleImages(Long propertyId, List<MultipartFile> files) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + propertyId));

        List<ImageDTO> uploadedImages = new ArrayList<>();
        List<String> failedUploads = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                ImageDTO imageDTO = uploadImage(propertyId, file);
                uploadedImages.add(imageDTO);
            } catch (Exception e) {
                log.error("Error uploading image: {}", file.getOriginalFilename(), e);
                failedUploads.add(file.getOriginalFilename());
            }
        }

        if (!failedUploads.isEmpty()) {
            log.warn("Some images failed to upload: {}", failedUploads);
        }

        return uploadedImages;
    }

    @Override
    @Transactional
    public void deleteAllPropertyImages(Long propertyId) {
        if (!propertyRepository.existsById(propertyId)) {
            throw new PropertyNotFoundException("Property not found with id: " + propertyId);
        }

        List<Image> images = imageRepository.findByPropertyId(propertyId);
        List<String> failedDeletes = new ArrayList<>();

        for (Image image : images) {
            try {
                String fileUrl = image.getUrl();
                String s3Key = fileUrl.substring(fileUrl.indexOf(bucketName) + bucketName.length() + 1);
                amazonS3.deleteObject(bucketName, s3Key);
            } catch (Exception e) {
                log.error("Error deleting image from S3: {}", image.getUrl(), e);
                failedDeletes.add(image.getName());
            }
        }

        // Delete all images from database
        imageRepository.deleteAll(images);

        if (!failedDeletes.isEmpty()) {
            log.warn("Some images failed to delete from S3: {}", failedDeletes);
        }
    }

    @Override
    @Transactional
    public ImageDTO updateImage(Long imageId, MultipartFile file) {
        Image existingImage = imageRepository.findById(imageId)
                .orElseThrow(() -> new ImageNotFoundException("Image not found with id: " + imageId));

        try {
            // Validate new image
            ImageServiceUtils.validateImage(file);

            // Delete existing image from S3
            String oldFileUrl = existingImage.getUrl();
            String oldS3Key = oldFileUrl.substring(oldFileUrl.indexOf(bucketName) + bucketName.length() + 1);
            amazonS3.deleteObject(bucketName, oldS3Key);

            // Upload new image
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            String fileName = UUID.randomUUID().toString() + fileExtension;

            String s3Key = ImageServiceUtils.generateS3Key(existingImage.getProperty().getId(), fileName);

            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());

            amazonS3.putObject(new PutObjectRequest(
                    bucketName,
                    s3Key,
                    file.getInputStream(),
                    metadata
            ));

            String fileUrl = amazonS3.getUrl(bucketName, s3Key).toString();

            // Update image metadata
            existingImage.setName(fileName);
            existingImage.setType(file.getContentType());
            existingImage.setUrl(fileUrl);

            Image updatedImage = imageRepository.save(existingImage);
            return imageMapper.toDTO(updatedImage);

        } catch (IOException e) {
            log.error("Error updating image: ", e);
            throw new ImageUploadException("Failed to update image: " + e.getMessage());
        } catch (AmazonS3Exception e) {
            log.error("S3 error during image update: ", e);
            throw new ImageUploadException("Failed to update image in storage: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public ImageDTO setMainImage(Long propertyId, Long imageId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + propertyId));

        Image mainImage = imageRepository.findById(imageId)
                .orElseThrow(() -> new ImageNotFoundException("Image not found with id: " + imageId));

        if (!mainImage.getProperty().getId().equals(propertyId)) {
            throw new IllegalArgumentException("Image does not belong to the specified property");
        }

        // Reset all images' main flag for this property
        List<Image> propertyImages = imageRepository.findByPropertyId(propertyId);
        propertyImages.forEach(img -> img.setIsMain(false));
        imageRepository.saveAll(propertyImages);

        // Set the new main image
        mainImage.setIsMain(true);
        Image savedImage = imageRepository.save(mainImage);

        return imageMapper.toDTO(savedImage);
    }

    @Override
    @Transactional
    public List<ImageDTO> reorderImages(Long propertyId, List<Long> imageIds) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + propertyId));

        List<Image> images = imageRepository.findAllById(imageIds);

        if (images.size() != imageIds.size()) {
            throw new ImageNotFoundException("One or more images not found");
        }

        // Validate all images belong to the property
        for (Image image : images) {
            if (!image.getProperty().getId().equals(propertyId)) {
                throw new IllegalArgumentException("Image does not belong to the specified property");
            }
        }

        // Update order
        for (int i = 0; i < imageIds.size(); i++) {
            Image image = images.get(i);
            image.setDisplayOrder(i);
            imageRepository.save(image);
        }

        return images.stream()
                .map(imageMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public byte[] downloadImage(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ImageNotFoundException("Image not found with id: " + imageId));

        String fileUrl = image.getUrl();
        String s3Key = fileUrl.substring(fileUrl.indexOf(bucketName) + bucketName.length() + 1);

        try {
            S3Object s3Object = amazonS3.getObject(bucketName, s3Key);
            S3ObjectInputStream inputStream = s3Object.getObjectContent();
            return inputStream.readAllBytes();
        } catch (IOException e) {
            log.error("Error reading image data: ", e);
            throw new ImageUploadException("Failed to read image data: " + e.getMessage());
        } catch (AmazonS3Exception e) {
            log.error("S3 error downloading image: ", e);
            throw new ImageUploadException("Failed to download image from storage: " + e.getMessage());
        }
    }
}