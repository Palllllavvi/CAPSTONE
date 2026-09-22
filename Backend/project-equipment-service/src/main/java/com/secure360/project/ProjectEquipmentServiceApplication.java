package com.secure360.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.secure360.project", "com.secure360.common"})
public class ProjectEquipmentServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProjectEquipmentServiceApplication.class, args);
    }
}
