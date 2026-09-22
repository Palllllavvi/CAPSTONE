package com.secure360.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.secure360.auth", "com.secure360.common"})
public class AuthUserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AuthUserServiceApplication.class, args);
    }
}
