package com.gymmanagement.controller;

import com.gymmanagement.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@CrossOrigin(origins = "*")
public class ImageController {
    private static final Logger logger = LoggerFactory.getLogger(ImageController.class);

    @Autowired
    private ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imagePath = imageService.saveImage(file);
            Map<String, String> response = new HashMap<>();
            response.put("imagePath", imagePath);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/upload-base64")
    public ResponseEntity<Map<String, String>> uploadBase64Image(@RequestBody Map<String, String> request) {
        try {
            logger.info("Received base64 image upload request");
            String base64Image = request.get("image");
            
            if (base64Image == null || base64Image.isEmpty()) {
                logger.error("No image data received");
                return ResponseEntity.badRequest().build();
            }
            
            logger.info("Base64 image length: {}", base64Image.length());
            String imagePath = imageService.saveBase64Image(base64Image);
            
            logger.info("Image saved successfully, path: {}", imagePath);
            Map<String, String> response = new HashMap<>();
            response.put("imagePath", imagePath);
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.error("Error uploading base64 image: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    // This endpoint is no longer needed since images will be served directly by the frontend server
    // But we'll keep it for backward compatibility
    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            byte[] imageData = imageService.getImage(filename);
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imageData);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
} 