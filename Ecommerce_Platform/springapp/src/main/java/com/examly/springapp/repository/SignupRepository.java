package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.SignupModel;

public interface SignupRepository extends JpaRepository<SignupModel, Long> {
    SignupModel findByEmail(String email);
}
