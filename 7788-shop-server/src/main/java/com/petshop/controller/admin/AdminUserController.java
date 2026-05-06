package com.petshop.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.petshop.common.PageResult;
import com.petshop.common.Result;
import com.petshop.entity.User;
import com.petshop.mapper.UserMapper;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {
    private final UserMapper userMapper;

    public AdminUserController(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @GetMapping
    public Result<PageResult<Map<String, Object>>> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        Page<User> mpPage = new Page<>(page, pageSize);
        Page<User> result = userMapper.selectPage(mpPage,
                new LambdaQueryWrapper<User>().orderByDesc(User::getCreatedAt));

        List<Map<String, Object>> records = result.getRecords().stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("email", u.getEmail());
            map.put("phone", u.getPhone());
            map.put("nickname", u.getNickname());
            map.put("role", u.getRole());
            map.put("createdAt", u.getCreatedAt());
            return map;
        }).toList();

        PageResult<Map<String, Object>> pageResult = new PageResult<>(
                records, result.getTotal(), result.getCurrent(), result.getSize());
        return Result.ok(pageResult);
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id) {
        User user = userMapper.selectById(id);
        if (user != null) {
            // toggle: if admin -> user, if user -> admin (simplified)
            user.setRole(user.getRole().equals("ADMIN") ? "USER" : "ADMIN");
            userMapper.updateById(user);
        }
        return Result.ok();
    }
}
