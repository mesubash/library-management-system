package com.projects.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		 // Load .env file
        Dotenv dotenv = Dotenv.configure()
                .directory("/Users/isubash/Codes/library-management-system/backend")
                .load();
        System.setProperty("JWT_SECRET_KEY", dotenv.get("JWT_SECRET_KEY"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

		SpringApplication.run(BackendApplication.class, args);
	}

}
