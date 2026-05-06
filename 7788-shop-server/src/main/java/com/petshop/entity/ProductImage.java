package com.petshop.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("product_images")
public class ProductImage implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long productId;
    private String imageUrl;
    private Integer sortOrder;

    @TableLogic
    private Integer isDeleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
