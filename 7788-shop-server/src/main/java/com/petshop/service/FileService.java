package com.petshop.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    /**
     * Upload a file and return its access URL.
     *
     * @param file the multipart file to upload
     * @return the relative URL path to the uploaded file
     */
    String upload(MultipartFile file);
}
