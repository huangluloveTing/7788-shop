package com.petshop.controller;

import com.petshop.common.Result;
import com.petshop.dto.request.AddressRequest;
import com.petshop.entity.Address;
import com.petshop.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/addresses")
public class AddressController {
    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    private Long getUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public Result<List<Address>> list() {
        return Result.ok(addressService.listAddresses(getUserId()));
    }

    @PostMapping
    public Result<Address> create(@Valid @RequestBody AddressRequest req) {
        return Result.ok(addressService.create(getUserId(), req));
    }

    @PutMapping("/{id}")
    public Result<Address> update(@PathVariable Long id, @Valid @RequestBody AddressRequest req) {
        return Result.ok(addressService.update(getUserId(), id, req));
    }

    @DeleteMapping("/{id}")
    public Result<Void> delete(@PathVariable Long id) {
        addressService.delete(getUserId(), id);
        return Result.ok();
    }

    @PutMapping("/{id}/default")
    public Result<Void> setDefault(@PathVariable Long id) {
        addressService.setDefault(getUserId(), id);
        return Result.ok();
    }
}
