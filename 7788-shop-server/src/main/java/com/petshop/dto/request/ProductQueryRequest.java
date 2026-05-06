package com.petshop.dto.request;

public class ProductQueryRequest {
    private String keyword;
    private Long categoryId;
    private java.math.BigDecimal minPrice;
    private java.math.BigDecimal maxPrice;
    private String sortBy;
    private Integer page = 1;
    private Integer pageSize = 12;

    public String getKeyword() { return keyword; }
    public void setKeyword(String keyword) { this.keyword = keyword; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public java.math.BigDecimal getMinPrice() { return minPrice; }
    public void setMinPrice(java.math.BigDecimal minPrice) { this.minPrice = minPrice; }
    public java.math.BigDecimal getMaxPrice() { return maxPrice; }
    public void setMaxPrice(java.math.BigDecimal maxPrice) { this.maxPrice = maxPrice; }
    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }
    public Integer getPage() { return page; }
    public void setPage(Integer page) { this.page = page; }
    public Integer getPageSize() { return pageSize; }
    public void setPageSize(Integer pageSize) { this.pageSize = pageSize; }
}
