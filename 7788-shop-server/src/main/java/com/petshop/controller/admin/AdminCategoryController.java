package com.petshop.controller.admin;

import com.petshop.common.Result;
import com.petshop.dto.request.CategorySaveRequest;
import com.petshop.entity.Category;
import com.petshop.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final CategoryService categoryService;

    public AdminCategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public Result<Category> create(@Valid @RequestBody CategorySaveRequest req) {
        Category category = categoryService.create(req);
        return Result.ok(category);
    }

    @PutMapping("/{id}")
    public Result<Category> update(@PathVariable Long id, @Valid @RequestBody CategorySaveRequest req) {
        Category category = categoryService.update(id, req);
        return Result.ok(category);
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return Result.ok();
    }
}
