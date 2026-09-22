package com.secure360.policy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.secure360.policy", "com.secure360.common"})
public class PolicyServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PolicyServiceApplication.class, args);
    }
}
