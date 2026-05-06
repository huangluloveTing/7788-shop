package com.petshop.service;

import com.petshop.dto.request.AddressRequest;
import com.petshop.entity.Address;

import java.util.List;

public interface AddressService {
    List<Address> listAddresses(Long userId);
    Address getById(Long userId, Long addressId);
    Address create(Long userId, AddressRequest req);
    Address update(Long userId, Long addressId, AddressRequest req);
    void delete(Long userId, Long addressId);
    void setDefault(Long userId, Long addressId);
}
