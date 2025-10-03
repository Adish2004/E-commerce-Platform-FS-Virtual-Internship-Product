// package com.examly.backend.service;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Service;
// import com.examly.backend.model.SignupModel;
// import com.examly.backend.repository.SignupRepository;

// import java.util.List;

// @Service
// public class SignupService {

//     @Autowired
//     private SignupRepository signupRepository;

//     // Signup logic
//     public ResponseEntity<String> signup(SignupModel user) {
//         String email = user.getEmail().toLowerCase(); // normalize
//         if (signupRepository.findByEmail(email) != null) {
//             return ResponseEntity.status(HttpStatus.CONFLICT)
//                     .body("User already exists. Please login.");
//         }
//         user.setEmail(email);
//         signupRepository.save(user);
//         return ResponseEntity.status(HttpStatus.CREATED)
//                 .body("Signup successful!");
//     }

//     // Login logic
//     public ResponseEntity<String> login(String email, String password, String role) {
//         SignupModel existingUser = signupRepository.findByEmail(email.toLowerCase());
//         if (existingUser == null) {
//             return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                     .body("User does not exist. Please signup.");
//         }
//         if (!existingUser.getPassword().equals(password)) {
//             return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                     .body("Incorrect password. Try again.");
//         }
//         if (!existingUser.getRole().equalsIgnoreCase(role)) {
//             return ResponseEntity.status(HttpStatus.FORBIDDEN)
//                     .body("You do not have access as " + role);
//         }
//         return ResponseEntity.ok("Login successful!");
//     }

//     // Fetch all users (Admin feature)
//     public List<SignupModel> getAllUsers() {
//         return signupRepository.findAll();
//     }

//     // Fetch single user by email
//     public SignupModel getUserByEmail(String email) {
//         return signupRepository.findByEmail(email.toLowerCase());
//     }

//     // Update profile (username, image, etc.)
//     public SignupModel updateProfile(Long id, SignupModel updatedUser) {
//         return signupRepository.findById(id).map(user -> {
//             user.setUsername(updatedUser.getUsername());
//             // user.setImage(updatedUser.getImage());
//             return signupRepository.save(user);
//         }).orElse(null);
//     }
// }




package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.SignupModel;
import com.examly.springapp.repository.SignupRepository;

import java.util.List;

@Service
public class SignupService {

    @Autowired
    private SignupRepository signupRepository;

    // Signup logic
    public ResponseEntity<String> signup(SignupModel user) {
        try {
            String email = user.getEmail().toLowerCase(); // normalize
            if (signupRepository.findByEmail(email) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("User already exists. Please login.");
            }
            user.setEmail(email);
            signupRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Signup successful!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Signup failed: " + e.getMessage());
        }
    }

    // Login logic
    public ResponseEntity<String> login(String email, String password, String role) {
        try {
            SignupModel existingUser = signupRepository.findByEmail(email.toLowerCase());
            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("User does not exist. Please signup.");
            }
            if (!existingUser.getPassword().equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Incorrect password. Try again.");
            }
            if (!existingUser.getRole().equalsIgnoreCase(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You do not have access as " + role);
            }
            return ResponseEntity.ok("Login successful!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }

    // Fetch all users
    public List<SignupModel> getAllUsers() {
        try {
            return signupRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch users", e);
        }
    }

    // Fetch single user
    public SignupModel getUserByEmail(String email) {
        try {
            return signupRepository.findByEmail(email.toLowerCase());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch user with email: " + email, e);
        }
    }

    // Update profile
    public SignupModel updateProfile(Long id, SignupModel updatedUser) {
        try {
            return signupRepository.findById(id).map(user -> {
                user.setUsername(updatedUser.getUsername());
                return signupRepository.save(user);
            }).orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update profile for user with ID " + id, e);
        }
    }
}
