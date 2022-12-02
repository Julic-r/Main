package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//Original Code from https://www.baeldung.com/spring-kafka
@SpringBootApplication
public class KafkaButtonReceiverServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(KafkaButtonReceiverServerApplication.class, args);
	}

}
