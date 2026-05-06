package com.petshop;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.petshop.mapper")
public class PetShopApplication {
    public static void main(String[] args) {
        SpringApplication.run(PetShopApplication.class, args);
    }
}
