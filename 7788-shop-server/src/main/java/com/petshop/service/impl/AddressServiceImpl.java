package com.petshop.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.petshop.common.BusinessException;
import com.petshop.common.ResultCode;
import com.petshop.dto.request.AddressRequest;
import com.petshop.entity.Address;
import com.petshop.mapper.AddressMapper;
import com.petshop.service.AddressService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressServiceImpl implements AddressService {
    private final AddressMapper addressMapper;

    public AddressServiceImpl(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    @Override
    public List<Address> listAddresses(Long userId) {
        return addressMapper.selectList(
                new LambdaQueryWrapper<Address>()
                        .eq(Address::getUserId, userId)
                        .orderByDesc(Address::getIsDefault));
    }

    @Override
    public Address getById(Long userId, Long addressId) {
        Address addr = addressMapper.selectById(addressId);
        if (addr == null || !addr.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.ADDRESS_NOT_FOUND);
        }
        return addr;
    }

    @Override
    public Address create(Long userId, AddressRequest req) {
        if (req.getIsDefault() == 1) {
            clearDefaults(userId);
        }
        Address addr = new Address();
        addr.setUserId(userId);
        copyFromRequest(addr, req);
        addressMapper.insert(addr);
        return addr;
    }

    @Override
    public Address update(Long userId, Long addressId, AddressRequest req) {
        Address addr = getById(userId, addressId);
        if (req.getIsDefault() == 1) {
            clearDefaults(userId);
        }
        copyFromRequest(addr, req);
        addressMapper.updateById(addr);
        return addr;
    }

    @Override
    public void delete(Long userId, Long addressId) {
        Address addr = getById(userId, addressId);
        addressMapper.deleteById(addr.getId());
    }

    @Override
    public void setDefault(Long userId, Long addressId) {
        Address addr = getById(userId, addressId);
        clearDefaults(userId);
        addr.setIsDefault(1);
        addressMapper.updateById(addr);
    }

    private void clearDefaults(Long userId) {
        addressMapper.update(null,
                new LambdaUpdateWrapper<Address>()
                        .eq(Address::getUserId, userId)
                        .set(Address::getIsDefault, 0));
    }

    private void copyFromRequest(Address addr, AddressRequest req) {
        addr.setReceiverName(req.getReceiverName());
        addr.setPhone(req.getPhone());
        addr.setProvince(req.getProvince());
        addr.setCity(req.getCity());
        addr.setDistrict(req.getDistrict());
        addr.setDetail(req.getDetail());
        addr.setIsDefault(req.getIsDefault());
    }
}
