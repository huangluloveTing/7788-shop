package com.petshop.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName("products")
public class Product implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long categoryId;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String mainImage;
    private Integer salesCount;
    private Integer isOnSale;

    @TableLogic
    private Integer isDeleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableField(exist = false)
    private String categoryName;

    @TableField(exist = false)
    private List<ProductImage> images;
}
