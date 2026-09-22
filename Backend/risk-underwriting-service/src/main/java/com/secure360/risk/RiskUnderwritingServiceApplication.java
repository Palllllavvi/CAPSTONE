package com.secure360.risk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.secure360.risk", "com.secure360.common"})
public class RiskUnderwritingServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(RiskUnderwritingServiceApplication.class, args);
    }
}
