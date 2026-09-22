package com.secure360.claim;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.secure360.claim", "com.secure360.common"})
public class ClaimServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClaimServiceApplication.class, args);
    }
}
