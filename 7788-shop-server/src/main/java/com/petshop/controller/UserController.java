package com.petshop.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.petshop.common.Result;
import com.petshop.entity.User;
import com.petshop.mapper.UserMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserMapper userMapper;

    public UserController(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    private Long getUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/profile")
    public Result<Map<String, Object>> profile() {
        User user = userMapper.selectById(getUserId());
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("email", user.getEmail());
        map.put("phone", user.getPhone());
        map.put("nickname", user.getNickname());
        map.put("avatar", user.getAvatar());
        map.put("role", user.getRole());
        return Result.ok(map);
    }

    @PutMapping("/profile")
    public Result<Void> updateProfile(@RequestBody Map<String, String> body) {
        User user = userMapper.selectById(getUserId());
        if (body.containsKey("nickname")) user.setNickname(body.get("nickname"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        if (body.containsKey("phone")) user.setPhone(body.get("phone"));
        userMapper.updateById(user);
        return Result.ok();
    }
}
