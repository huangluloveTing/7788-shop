package com.petshop.controller;

import com.petshop.common.Result;
import com.petshop.dto.request.LoginRequest;
import com.petshop.dto.request.RegisterRequest;
import com.petshop.entity.User;
import com.petshop.security.JwtTokenProvider;
import com.petshop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public Result<User> register(@Valid @RequestBody RegisterRequest req) {
        User user = userService.register(req);
        return Result.ok(user);
    }

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginRequest req) {
        String token = userService.login(req);
        Long userId = jwtTokenProvider.getUserIdFromToken(token);
        String username = jwtTokenProvider.getUsernameFromToken(token);
        String role = jwtTokenProvider.getRoleFromToken(token);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("token", token);
        data.put("userId", userId);
        data.put("username", username);
        data.put("role", role);

        return Result.ok(data);
    }
}
