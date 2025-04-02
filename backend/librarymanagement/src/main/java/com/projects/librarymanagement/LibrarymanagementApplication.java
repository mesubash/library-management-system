package com.projects.librarymanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
public class LibrarymanagementApplication {

	public static void main(String[] args) {
		 // Load .env file
        Dotenv dotenv = Dotenv.configure().load();
        System.setProperty("JWT_SECRET_KEY", dotenv.get("JWT_SECRET_KEY"));
        System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

		SpringApplication.run(LibrarymanagementApplication.class, args);
	}

}
