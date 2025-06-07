package com.shreyas.Hotel.Management.System;

import com.shreyas.Hotel.Management.System.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HotelManagementSystemApplication {
	public static void main(String[] args) {
		SpringApplication.run(HotelManagementSystemApplication.class, args);
	}
}
// npx localtunnel --port 8080 --subdomain galvanichotel
//curl https://loca.lt/mytunnelpassword
//122.171.20.
