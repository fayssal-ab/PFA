package com.emsi.pfa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
@EnableSpringDataWebSupport(
    pageSerializationMode = EnableSpringDataWebSupport.PageSerializationMode.VIA_DTO
)
public class PfaApplication {

	public static void main(String[] args) {
		System.out.println("HASH: " + new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("admin123"));
		SpringApplication.run(PfaApplication.class, args);
	}

}