package com.petshop.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.petshop.common.BusinessException;
import com.petshop.common.ResultCode;
import com.petshop.dto.request.CategorySaveRequest;
import com.petshop.entity.Category;
import com.petshop.mapper.CategoryMapper;
import com.petshop.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    public CategoryServiceImpl(CategoryMapper categoryMapper) {
        this.categoryMapper = categoryMapper;
    }

    @Override
    public List<Category> listAll() {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(Category::getSortOrder);
        return categoryMapper.selectList(wrapper);
    }

    @Override
    public Category getById(Long id) {
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        return category;
    }

    @Override
    public Category create(CategorySaveRequest req) {
        Category category = new Category();
        category.setName(req.getName());
        category.setParentId(req.getParentId());
        category.setIcon(req.getIcon());
        category.setSortOrder(req.getSortOrder());
        categoryMapper.insert(category);
        return category;
    }

    @Override
    public Category update(Long id, CategorySaveRequest req) {
        Category category = getById(id);
        category.setName(req.getName());
        category.setParentId(req.getParentId());
        category.setIcon(req.getIcon());
        category.setSortOrder(req.getSortOrder());
        categoryMapper.updateById(category);
        return category;
    }

    @Override
    public void delete(Long id) {
        getById(id);
        categoryMapper.deleteById(id);
    }
}
