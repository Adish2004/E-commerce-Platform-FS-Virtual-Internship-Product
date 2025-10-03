package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.SignupModel;
import com.examly.springapp.service.SignupService;

import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@CrossOrigin(origins = "https://8081-dcebadbaaeaaec334072909bccfaccecfone.premiumproject.examly.io")
// @RequestMapping("/api")
public class SignupController {

    @Autowired
    private SignupService signupService;

    @PostMapping("/signup")
    public ResponseEntity<String> register(@RequestBody SignupModel user) {
        return signupService.signup(user);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody SignupModel user) {
        return signupService.login(user.getEmail(), user.getPassword(), user.getRole());
    }

    @GetMapping("/profile")
    public List<SignupModel> getAllUsers() {
        return signupService.getAllUsers();
    }

    @GetMapping("/profile/{email}")
    public SignupModel getUserByEmail(@PathVariable String email) {
        return signupService.getUserByEmail(email);
    }

    @PutMapping("/profile/{id}")
    public SignupModel updateProfile(@PathVariable Long id, @RequestBody SignupModel updatedUser) {
        return signupService.updateProfile(id, updatedUser);
    }
}
