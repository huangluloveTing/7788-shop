package com.petshop.controller;

import com.petshop.common.Result;
import com.petshop.entity.Category;
import com.petshop.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public Result<List<Category>> listAll() {
        List<Category> categories = categoryService.listAll();
        return Result.ok(categories);
    }
}
