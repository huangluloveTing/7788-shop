package com.petshop.dto.request;

import jakarta.validation.constraints.NotNull;

public class CheckoutRequest {
    @NotNull(message = "Address ID is required")
    private Long addressId;

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
}
