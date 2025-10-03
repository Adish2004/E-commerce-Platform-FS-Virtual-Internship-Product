package com.examly.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.examly.springapp.model.ProductModel;
import com.examly.springapp.service.ProductService;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "https://8081-dcebadbaaeaaec334072909bccfaccecfone.premiumproject.examly.io")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/adminform/add")
    public ProductModel createProduct(@RequestBody ProductModel product) {
        return productService.saveProduct(product);
    }

    @PutMapping("/adminform/edit/{id}")
    public ProductModel updateProduct(@PathVariable Long id, @RequestBody ProductModel product) {
        product.setId(id);
        return productService.updateProduct(product);
    }

    @GetMapping("/adminlist")
    public List<ProductModel> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/adminlist/edit/{id}")
    public ProductModel getProduct(@PathVariable Long id) {
        return productService.getProduct(id);
    }

    @DeleteMapping("/adminlist/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @PostMapping("/order")
    public String placeOrder(@RequestBody List<Map<String, Object>> orderedProducts) {
        for (Map<String, Object> productData : orderedProducts) {
            Long id = Long.valueOf(productData.get("id").toString());
            int quantity = Integer.parseInt(productData.get("quantity").toString());
            productService.increaseSales(id, quantity);
        }
        return "Order placed and sales count updated!";
    }

    @PostMapping("/adminlist/toggle/{id}")
    public ProductModel toggleProduct(@PathVariable Long id) {
        productService.toggleProduct(id);
        return productService.getProduct(id);
    }
}
