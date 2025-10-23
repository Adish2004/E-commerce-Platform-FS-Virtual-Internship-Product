package com.examly.springapp;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.io.File;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest
@AutoConfigureMockMvc
public class SpringappApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    private final String basePath = "src/main/java/com/examly/springapp";
    private final ObjectMapper mapper = new ObjectMapper();

    /** ---------------- Structure Test ---------------- */
    @Test
    @Order(1)
    public void Backend_check_ProjectStructure() {
        assertTrue(new File(basePath + "/controller/SignupController.java").exists(), "SignupController missing");
        assertTrue(new File(basePath + "/controller/ProductController.java").exists(), "ProductController missing");
        assertTrue(new File(basePath + "/service/SignupService.java").exists(), "SignupService missing");
        assertTrue(new File(basePath + "/service/ProductService.java").exists(), "ProductService missing");
        assertTrue(new File(basePath + "/repository/SignupRepository.java").exists(), "SignupRepository missing");
        assertTrue(new File(basePath + "/repository/ProductRepository.java").exists(), "ProductRepository missing");
    }

    /** ---------------- Signup Tests ---------------- */
    @Test
    @Order(2)
    public void Backend_test_SignupNewUser_Success() throws Exception {

        // Generate unique suffix using timestamp
        String uniqueId = String.valueOf(System.currentTimeMillis());

        String username = "user" + uniqueId;
        String email = "user" + uniqueId + "@example.com";

        String json = "{ \"username\": \"" + username + "\", " +
                    "\"email\": \"" + email + "\", " +
                    "\"password\": \"12345\", " +
                    "\"role\": \"user\" }";

        mockMvc.perform(post("/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(json))
            .andExpect(status().isCreated())
            .andExpect(content().string(containsString("Signup successful")));
    }

    @Test
    @Order(3)
    public void Backend_test_SignupExistingUser_Conflict() throws Exception {
        String json = "{ \"username\": \"John Doe\", " +
                      "\"email\": \"john@example.com\", " +
                      "\"password\": \"12345\", " +
                      "\"role\": \"user\" }";
        
        mockMvc.perform(post("/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json));


        mockMvc.perform(post("/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isConflict())
                .andExpect(content().string(containsString("User already exists")));
    }

    @Test
    @Order(4)
    public void Backend_test_Login_Success() throws Exception {
        String json = "{ \"email\": \"john@example.com\", " +
                      "\"password\": \"12345\", " +
                      "\"role\": \"user\" }";

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("Login successful!"));
    }

    @Test
    @Order(5)
    public void Backend_test_Login_InvalidPassword() throws Exception {
        String json = "{ \"email\": \"john@example.com\", " +
                      "\"password\": \"wrong\", " +
                      "\"role\": \"user\" }";

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string(containsString("Incorrect password")));
    }

    @Test
    @Order(6)
    public void Backend_test_Login_InvalidRole() throws Exception {
        String json = "{ \"email\": \"john@example.com\", " +
                      "\"password\": \"12345\", " +
                      "\"role\": \"admin\" }";

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isForbidden())
                .andExpect(content().string(containsString("do not have access")));
    }

    @Test
    @Order(7)
    public void Backend_test_Login_UserNotFound() throws Exception {
        String json = "{ \"email\": \"ghost@example.com\", " +
                      "\"password\": \"12345\", " +
                      "\"role\": \"user\" }";

        mockMvc.perform(post("/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isNotFound())
                .andExpect(content().string(containsString("User does not exist")));
    }

    /** ---------------- Product Tests ---------------- */
    @Test
    @Order(8)
    public void Backend_test_AddProduct() throws Exception {
        String json = "{ \"name\": \"Laptop\", " +
                      "\"description\": \"Gaming Laptop\", " +
                      "\"price\": 75000, " +
                      "\"stock\": 10 }";

        mockMvc.perform(post("/adminform/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Laptop"));
    }

    @Test
    @Order(9)
    public void Backend_test_GetAllProducts() throws Exception {
        mockMvc.perform(get("/adminlist"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", not(empty())));
    }

    @Test
    @Order(10)
    public void Backend_test_ToggleProduct() throws Exception {
        mockMvc.perform(post("/adminlist/toggle/3"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.disabled").isBoolean());
    }

    @Test
    @Order(11)
    public void Backend_test_ToggleProduct_NotFound() throws Exception {
        mockMvc.perform(post("/adminlist/toggle/9999"))
                .andExpect(status().isOk()) // service silently ignores → 200
                .andExpect(content().string("")); 
    }

    @Test
    @Order(12)
    public void Backend_test_DeleteProduct() throws Exception {
        mockMvc.perform(delete("/adminlist/1"))
                .andExpect(status().isOk());
    }

    @Test
    @Order(13)
    public void Backend_test_DeleteProduct_NotFound() throws Exception {
        mockMvc.perform(delete("/adminlist/9999"))
                .andExpect(status().isOk()); // repository silently ignores missing ID
    }
}
