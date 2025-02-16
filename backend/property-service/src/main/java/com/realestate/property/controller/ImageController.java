package com.realestate.property.controller;

import com.realestate.property.dto.ImageDTO;
import com.realestate.property.service.ImageService;
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
public class ImageController {
    private final ImageService imageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageDTO> uploadImage(
            @PathVariable Long propertyId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(imageService.uploadImage(propertyId, file));
    }

    @GetMapping
    public ResponseEntity<List<ImageDTO>> getPropertyImages(@PathVariable Long propertyId) {
        return ResponseEntity.ok(imageService.getPropertyImages(propertyId));
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/multiple")
    public ResponseEntity<List<ImageDTO>> uploadMultipleImages(
            @PathVariable Long propertyId,
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(imageService.uploadMultipleImages(propertyId, files));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAllPropertyImages(@PathVariable Long propertyId) {
        imageService.deleteAllPropertyImages(propertyId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{imageId}")
    public ResponseEntity<ImageDTO> updateImage(
            @PathVariable Long propertyId,
            @PathVariable Long imageId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(imageService.updateImage(imageId, file));
    }

    @PutMapping("/{imageId}/main")
    public ResponseEntity<ImageDTO> setMainImage(
            @PathVariable Long propertyId,
            @PathVariable Long imageId) {
        return ResponseEntity.ok(imageService.setMainImage(propertyId, imageId));
    }

    @PutMapping("/reorder")
    public ResponseEntity<List<ImageDTO>> reorderImages(
            @PathVariable Long propertyId,
            @RequestBody List<Long> imageIds) {
        return ResponseEntity.ok(imageService.reorderImages(propertyId, imageIds));
    }

    @GetMapping("/{imageId}/download")
    public ResponseEntity<byte[]> downloadImage(
            @PathVariable Long propertyId,
            @PathVariable Long imageId) {
        byte[] imageData = imageService.downloadImage(imageId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"image\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(imageData);
    }
}