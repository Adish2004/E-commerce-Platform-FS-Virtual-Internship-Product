// package com.examly.backend.service;

// import com.examly.backend.model.ProductModel;
// import com.examly.backend.repository.ProductRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.util.List;
// import java.util.Optional;

// @Service
// public class ProductService {

//     @Autowired
//     private ProductRepository productRepository;

//     public List<ProductModel> getAllProducts() {
//         return productRepository.findAll();
//     }

//     public ProductModel getProduct(Long id) {
//         return productRepository.findById(id).orElse(null);
//     }

//     public ProductModel saveProduct(ProductModel product) {
//         return productRepository.save(product);
//     }

//     public ProductModel updateProduct(ProductModel product) {
//         return productRepository.save(product);
//     }



//     public void deleteProduct(Long id) {
//         productRepository.deleteById(id);
//     }

//     public void increaseSales(Long id, int quantity) {
//         ProductModel product = productRepository.findById(id).orElse(null);
//         if (product != null) {
//             product.setSalesCount(product.getSalesCount() + quantity);
//             product.setStock(Math.max(product.getStock() - quantity, 0));
//             productRepository.save(product);
//         }
//     }

//     public void toggleProduct(Long id) {
//         ProductModel product = productRepository.findById(id).orElse(null);
//         if (product != null) {
//             product.setDisabled(!product.isDisabled());
//             productRepository.save(product);
//         }
//     }

// }



package com.examly.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.ProductModel;
import com.examly.springapp.repository.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<ProductModel> getAllProducts() {
        try {
            return productRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch products", e);
        }
    }

    public ProductModel getProduct(Long id) {
        try {
            return productRepository.findById(id).orElse(null);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch product with ID " + id, e);
        }
    }

    public ProductModel saveProduct(ProductModel product) {
        try {
            return productRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save product", e);
        }
    }

    public ProductModel updateProduct(ProductModel product) {
        try {
            return productRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update product", e);
        }
    }

    public void deleteProduct(Long id) {
        try {
            productRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete product with ID " + id, e);
        }
    }

    public void increaseSales(Long id, int quantity) {
        try {
            ProductModel product = productRepository.findById(id).orElse(null);
            if (product != null) {
                product.setSalesCount(product.getSalesCount() + quantity);
                product.setStock(Math.max(product.getStock() - quantity, 0));
                productRepository.save(product);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to increase sales for product with ID " + id, e);
        }
    }

    public void toggleProduct(Long id) {
        try {
            ProductModel product = productRepository.findById(id).orElse(null);
            if (product != null) {
                product.setDisabled(!product.isDisabled());
                productRepository.save(product);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to toggle product with ID " + id, e);
        }
    }
}
