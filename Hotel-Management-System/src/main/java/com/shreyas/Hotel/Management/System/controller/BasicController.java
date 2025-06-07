package com.shreyas.Hotel.Management.System.controller;

import com.shreyas.Hotel.Management.System.dao.UserDao;
import com.shreyas.Hotel.Management.System.service.BasicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class BasicController {
//    @Autowired
//    BasicService basicService;
//    @PostMapping("/login")
//    public UserDao login(@RequestParam String email, @RequestParam String password) {
//        return basicService.login(email, password);
//    }
}
