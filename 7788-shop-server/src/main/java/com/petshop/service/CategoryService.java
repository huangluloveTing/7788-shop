package com.petshop.service;

import com.petshop.dto.request.CategorySaveRequest;
import com.petshop.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> listAll();
    Category getById(Long id);
    Category create(CategorySaveRequest req);
    Category update(Long id, CategorySaveRequest req);
    void delete(Long id);
}
