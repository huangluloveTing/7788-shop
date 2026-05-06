package com.petshop.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.petshop.common.BusinessException;
import com.petshop.common.PageResult;
import com.petshop.common.ResultCode;
import com.petshop.dto.request.ProductQueryRequest;
import com.petshop.dto.request.ProductSaveRequest;
import com.petshop.entity.Category;
import com.petshop.entity.Product;
import com.petshop.entity.ProductImage;
import com.petshop.mapper.CategoryMapper;
import com.petshop.mapper.ProductImageMapper;
import com.petshop.mapper.ProductMapper;
import com.petshop.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductImageMapper productImageMapper;
    private final CategoryMapper categoryMapper;

    public ProductServiceImpl(ProductMapper productMapper,
                              ProductImageMapper productImageMapper,
                              CategoryMapper categoryMapper) {
        this.productMapper = productMapper;
        this.productImageMapper = productImageMapper;
        this.categoryMapper = categoryMapper;
    }

    @Override
    public PageResult<Product> queryProducts(ProductQueryRequest req) {
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Product::getIsOnSale, 1);

        if (req.getKeyword() != null && !req.getKeyword().isBlank()) {
            wrapper.like(Product::getName, req.getKeyword());
        }
        if (req.getCategoryId() != null) {
            wrapper.eq(Product::getCategoryId, req.getCategoryId());
        }
        if (req.getMinPrice() != null) {
            wrapper.ge(Product::getPrice, req.getMinPrice());
        }
        if (req.getMaxPrice() != null) {
            wrapper.le(Product::getPrice, req.getMaxPrice());
        }

        String sortBy = req.getSortBy();
        if ("price-asc".equals(sortBy)) {
            wrapper.orderByAsc(Product::getPrice);
        } else if ("price-desc".equals(sortBy)) {
            wrapper.orderByDesc(Product::getPrice);
        } else if ("sales".equals(sortBy)) {
            wrapper.orderByDesc(Product::getSalesCount);
        } else {
            wrapper.orderByDesc(Product::getCreatedAt);
        }

        Page<Product> page = new Page<>(req.getPage(), req.getPageSize());
        Page<Product> result = productMapper.selectPage(page, wrapper);

        List<Product> records = result.getRecords();
        if (!records.isEmpty()) {
            List<Long> categoryIds = records.stream()
                    .map(Product::getCategoryId)
                    .distinct()
                    .collect(Collectors.toList());
            List<Category> categories = categoryMapper.selectBatchIds(categoryIds);
            Map<Long, String> categoryNameMap = categories.stream()
                    .collect(Collectors.toMap(Category::getId, Category::getName));
            records.forEach(p -> p.setCategoryName(categoryNameMap.get(p.getCategoryId())));
        }

        return new PageResult<>(
                result.getRecords(),
                result.getTotal(),
                result.getCurrent(),
                result.getSize());
    }

    @Override
    public Product getDetail(Long id) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_FOUND);
        }

        if (product.getCategoryId() != null) {
            Category category = categoryMapper.selectById(product.getCategoryId());
            if (category != null) {
                product.setCategoryName(category.getName());
            }
        }

        LambdaQueryWrapper<ProductImage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ProductImage::getProductId, id)
                .orderByAsc(ProductImage::getSortOrder);
        List<ProductImage> images = productImageMapper.selectList(wrapper);
        product.setImages(images);

        return product;
    }

    @Override
    public Product create(ProductSaveRequest req) {
        Product product = new Product();
        product.setCategoryId(req.getCategoryId());
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setStock(req.getStock());
        product.setMainImage(req.getMainImage());
        product.setSalesCount(0);
        product.setIsOnSale(1);
        productMapper.insert(product);

        if (req.getImages() != null && !req.getImages().isEmpty()) {
            saveImages(product.getId(), req.getImages());
        }

        return product;
    }

    @Override
    public Product update(Long id, ProductSaveRequest req) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_FOUND);
        }

        product.setCategoryId(req.getCategoryId());
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setPrice(req.getPrice());
        product.setStock(req.getStock());
        product.setMainImage(req.getMainImage());
        productMapper.updateById(product);

        if (req.getImages() != null) {
            LambdaQueryWrapper<ProductImage> wrapper = new LambdaQueryWrapper<>();
            wrapper.eq(ProductImage::getProductId, id);
            productImageMapper.delete(wrapper);

            if (!req.getImages().isEmpty()) {
                saveImages(id, req.getImages());
            }
        }

        return product;
    }

    @Override
    public void delete(Long id) {
        Product product = productMapper.selectById(id);
        if (product == null) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_FOUND);
        }
        productMapper.deleteById(id);
    }

    private void saveImages(Long productId, List<String> imageUrls) {
        for (int i = 0; i < imageUrls.size(); i++) {
            ProductImage image = new ProductImage();
            image.setProductId(productId);
            image.setImageUrl(imageUrls.get(i));
            image.setSortOrder(i);
            productImageMapper.insert(image);
        }
    }
}
