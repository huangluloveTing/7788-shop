package com.petshop.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CategorySaveRequest {
    @NotBlank(message = "Category name is required")
    private String name;

    private Long parentId = 0L;
    private String icon;
    private Integer sortOrder = 0;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Integer getSortOrder() { return sortOrder; }
    public void setSortOrder(Integer sortOrder) { this.sortOrder = sortOrder; }
}
