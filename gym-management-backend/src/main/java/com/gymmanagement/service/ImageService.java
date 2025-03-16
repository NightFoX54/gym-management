package com.gymmanagement.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ImageService {
    private static final Logger logger = LoggerFactory.getLogger(ImageService.class);

    // Change this path to point to your frontend's public folder - use absolute path for reliability
    private final String uploadDir;
    private final String relativePath = "/uploads/images/";

    public ImageService() {
        // Get the current working directory
        String currentDir = System.getProperty("user.dir");
        logger.info("Current working directory: {}", currentDir);
        
        // Set the upload directory to the frontend's public folder
        this.uploadDir = currentDir + "/../gym-management/public/uploads/images/";
        logger.info("Upload directory set to: {}", uploadDir);
        
        // Create upload directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            logger.info("Created directory {}: {}", uploadDir, created);
        } else {
            logger.info("Directory already exists: {}", uploadDir);
        }
    }

    public String saveBase64Image(String base64Image) throws IOException {
        if (base64Image == null || base64Image.isEmpty()) {
            logger.error("Base64 image is null or empty");
            throw new IOException("Base64 image is null or empty");
        }
        
        logger.info("Saving base64 image, length: {}", base64Image.length());
        
        // Extract the image data from the base64 string
        String[] parts = base64Image.split(",");
        String imageData = parts.length > 1 ? parts[1] : parts[0];
        
        // Determine file extension from the base64 header
        String extension = "jpg"; // Default extension
        if (parts.length > 1 && parts[0].contains("image/")) {
            extension = parts[0].split("image/")[1].split(";")[0];
            logger.info("Detected image extension: {}", extension);
        }
        
        // Generate a unique filename
        String filename = UUID.randomUUID().toString() + "." + extension;
        Path filePath = Paths.get(uploadDir + filename);
        logger.info("Saving image to: {}", filePath.toString());
        
        try {
            // Decode and save the image
            byte[] decodedImg = java.util.Base64.getDecoder().decode(imageData);
            logger.info("Decoded image size: {} bytes", decodedImg.length);
            
            Files.write(filePath, decodedImg);
            logger.info("Image saved successfully");
            
            // Return the relative path to the file (for frontend use)
            String path = relativePath + filename;
            logger.info("Returning image path: {}", path);
            return path;
        } catch (Exception e) {
            logger.error("Error saving image: {}", e.getMessage(), e);
            throw new IOException("Failed to save image: " + e.getMessage(), e);
        }
    }
    
    public String saveImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            logger.error("File is null or empty");
            throw new IOException("File is null or empty");
        }
        
        logger.info("Saving file: {}, size: {}", file.getOriginalFilename(), file.getSize());
        
        // Generate a unique filename
        String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + filename);
        logger.info("Saving file to: {}", filePath.toString());
        
        try {
            // Save the file
            Files.write(filePath, file.getBytes());
            logger.info("File saved successfully");
            
            // Return the relative path to the file (for frontend use)
            String path = relativePath + filename;
            logger.info("Returning file path: {}", path);
            return path;
        } catch (Exception e) {
            logger.error("Error saving file: {}", e.getMessage(), e);
            throw new IOException("Failed to save file: " + e.getMessage(), e);
        }
    }
    
    public byte[] getImage(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir + filename);
        logger.info("Reading image from: {}", filePath.toString());
        
        if (!Files.exists(filePath)) {
            logger.error("Image file not found: {}", filePath.toString());
            throw new IOException("Image file not found");
        }
        
        return Files.readAllBytes(filePath);
    }
} 