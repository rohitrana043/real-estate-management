package com.realestate.property.controller;

import com.realestate.property.config.PropertyApiResponses.StandardResponses;
import com.realestate.property.dto.ImageDTO;
import com.realestate.property.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/properties/{propertyId}/images")
@RequiredArgsConstructor
@Tag(name = "Property Images", description = "Property image management APIs")
@SecurityRequirement(name = "bearer-jwt")
public class ImageController {
    private final ImageService imageService;

    @Operation(
            summary = "Upload a single image",
            description = "Upload a single image for a specific property"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Image uploaded successfully",
            content = @Content(schema = @Schema(implementation = ImageDTO.class))
    )
    @StandardResponses
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageDTO> uploadImage(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId,
            @Parameter(
                    description = "Image file to upload (max 5MB)",
                    required = true,
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
            )
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(imageService.uploadImage(propertyId, file));
    }

    @Operation(
            summary = "Get all property images",
            description = "Retrieve all images associated with a specific property"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Images retrieved successfully",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ImageDTO.class)))
    )
    @StandardResponses
    @GetMapping
    public ResponseEntity<List<ImageDTO>> getPropertyImages(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId
    ) {
        return ResponseEntity.ok(imageService.getPropertyImages(propertyId));
    }

    @Operation(
            summary = "Delete a specific image",
            description = "Delete a single image by its ID"
    )
    @StandardResponses
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @Parameter(description = "Image ID", required = true)
            @PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.ok().build();
    }
    @Operation(
            summary = "Upload multiple images",
            description = "Upload multiple images for a specific property"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Images uploaded successfully",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ImageDTO.class)))
    )
    @StandardResponses
    @PostMapping("/multiple")
    public ResponseEntity<List<ImageDTO>> uploadMultipleImages(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId,
            @Parameter(
                    description = "List of image files to upload (max 5MB each)",
                    required = true,
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
            )
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(imageService.uploadMultipleImages(propertyId, files));
    }

    @Operation(
            summary = "Delete all property images",
            description = "Delete all images associated with a specific property"
    )
    @StandardResponses
    @DeleteMapping
    public ResponseEntity<Void> deleteAllPropertyImages(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId) {
        imageService.deleteAllPropertyImages(propertyId);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Update an image",
            description = "Update an existing image with a new file"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Image updated successfully",
            content = @Content(schema = @Schema(implementation = ImageDTO.class))
    )
    @StandardResponses
    @PutMapping("/{imageId}")
    public ResponseEntity<ImageDTO> updateImage(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId,
            @Parameter(description = "Image ID", required = true)
            @PathVariable Long imageId,
            @Parameter(
                    description = "New image file (max 5MB)",
                    required = true,
                    content = @Content(mediaType = MediaType.MULTIPART_FORM_DATA_VALUE)
            )
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(imageService.updateImage(imageId, file));
    }

    @Operation(
            summary = "Set main image",
            description = "Set a specific image as the main image for a property"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Main image set successfully",
            content = @Content(schema = @Schema(implementation = ImageDTO.class))
    )
    @StandardResponses
    @PutMapping("/{imageId}/main")
    public ResponseEntity<ImageDTO> setMainImage(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId,
            @Parameter(description = "Image ID to set as main", required = true)
            @PathVariable Long imageId) {
        return ResponseEntity.ok(imageService.setMainImage(propertyId, imageId));
    }

    @Operation(
            summary = "Reorder images",
            description = "Reorder the images of a property by providing the desired order of image IDs"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Images reordered successfully",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ImageDTO.class)))
    )
    @StandardResponses
    @PutMapping("/reorder")
    public ResponseEntity<List<ImageDTO>> reorderImages(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId,
            @Parameter(
                    description = "List of image IDs in the desired order",
                    required = true,
                    schema = @Schema(type = "array", implementation = Long.class)
            )
            @RequestBody List<Long> imageIds) {
        return ResponseEntity.ok(imageService.reorderImages(propertyId, imageIds));
    }

    @Operation(
            summary = "Download image",
            description = "Download a specific image file"
    )
    @ApiResponse(
            responseCode = "200",
            description = "Image downloaded successfully",
            content = @Content(mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    )
    @StandardResponses
    @GetMapping("/{imageId}/download")
    public ResponseEntity<byte[]> downloadImage(
            @Parameter(description = "Property ID", required = true)
            @PathVariable Long propertyId,
            @Parameter(description = "Image ID to download", required = true)
            @PathVariable Long imageId) {
        byte[] imageData = imageService.downloadImage(imageId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"image\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(imageData);
    }
}