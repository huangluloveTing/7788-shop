package com.petshop.service;

import com.petshop.common.PageResult;
import com.petshop.dto.request.ProductQueryRequest;
import com.petshop.dto.request.ProductSaveRequest;
import com.petshop.entity.Product;

public interface ProductService {

    PageResult<Product> queryProducts(ProductQueryRequest req);

    Product getDetail(Long id);

    Product create(ProductSaveRequest req);

    Product update(Long id, ProductSaveRequest req);

    void delete(Long id);
}
