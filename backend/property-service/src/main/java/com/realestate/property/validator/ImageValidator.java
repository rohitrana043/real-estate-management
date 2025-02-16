package com.realestate.property.validator;

import com.realestate.property.dto.ImageDTO;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class ImageValidator implements Validator {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    @Override
    public boolean supports(Class<?> clazz) {
        return ImageDTO.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ImageDTO imageDTO = (ImageDTO) target;

        // Validate file size
        if (imageDTO.getFileSize() != null && imageDTO.getFileSize() > MAX_FILE_SIZE) {
            errors.rejectValue("fileSize", "fileSize.too.large",
                    "File size must not exceed 5MB");
        }

        // Validate image type
        if (imageDTO.getType() != null) {
            String type = imageDTO.getType().toLowerCase();
            if (!type.startsWith("image/")) {
                errors.rejectValue("type", "type.invalid",
                        "File must be an image");
            }
            if (!type.matches("image/(jpeg|png|gif)")) {
                errors.rejectValue("type", "type.unsupported",
                        "Only JPEG, PNG and GIF images are supported");
            }
        }

        // Validate display order
        if (imageDTO.getDisplayOrder() != null && imageDTO.getDisplayOrder() < 0) {
            errors.rejectValue("displayOrder", "displayOrder.negative",
                    "Display order cannot be negative");
        }
    }
}