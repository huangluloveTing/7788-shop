package com.petshop.service;

import com.petshop.dto.request.LoginRequest;
import com.petshop.dto.request.RegisterRequest;
import com.petshop.entity.User;

public interface UserService {
    User register(RegisterRequest req);
    String login(LoginRequest req);
}
