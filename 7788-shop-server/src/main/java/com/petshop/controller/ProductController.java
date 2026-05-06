package com.petshop.controller;

import com.petshop.common.PageResult;
import com.petshop.common.Result;
import com.petshop.dto.request.ProductQueryRequest;
import com.petshop.entity.Product;
import com.petshop.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public Result<PageResult<Product>> query(ProductQueryRequest req) {
        PageResult<Product> result = productService.queryProducts(req);
        return Result.ok(result);
    }

    @GetMapping("/{id}")
    public Result<Product> detail(@PathVariable Long id) {
        Product product = productService.getDetail(id);
        return Result.ok(product);
    }
}
