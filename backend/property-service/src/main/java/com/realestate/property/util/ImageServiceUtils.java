package com.realestate.property.util;

import com.realestate.property.exception.ImageUploadException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class ImageServiceUtils {
    private static final Set<String> ALLOWED_CONTENT_TYPES = new HashSet<>(Arrays.asList(
            "image/jpeg",
            "image/png",
            "image/gif"
    ));

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    public static void validateImage(MultipartFile file) {
        // Check if file is empty
        if (file.isEmpty()) {
            throw new ImageUploadException("Failed to upload empty file");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ImageUploadException("File size exceeds maximum limit of 5MB");
        }

        // Check file type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new ImageUploadException("Invalid file type. Only JPEG, PNG and GIF are allowed");
        }
    }

    public static String generateS3Key(Long propertyId, String fileName) {
        return String.format("properties/%d/%s", propertyId, fileName);
    }
}