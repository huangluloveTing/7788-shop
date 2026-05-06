package com.petshop.common;

public enum ResultCode {
    SUCCESS(200, "success"),
    BAD_REQUEST(400, "Bad request"),
    UNAUTHORIZED(401, "Unauthorized"),
    FORBIDDEN(403, "Forbidden"),
    NOT_FOUND(404, "Not found"),
    INTERNAL_ERROR(500, "Internal server error"),

    USERNAME_EXISTS(1001, "Username already exists"),
    INVALID_CREDENTIALS(1002, "Invalid username or password"),
    STOCK_INSUFFICIENT(1003, "Insufficient stock"),
    ORDER_STATUS_INVALID(1004, "Cannot modify order in its current status"),
    CART_EMPTY(1005, "Cart is empty"),
    ADDRESS_NOT_FOUND(1006, "Address not found"),
    PRODUCT_NOT_FOUND(1007, "Product not found"),
    FILE_UPLOAD_FAILED(1008, "File upload failed");

    private final int code;
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() { return code; }
    public String getMessage() { return message; }
}
