package com.realestate.gateway.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.Map;

@Controller
public class HomeController {

    private final DiscoveryClient discoveryClient;

    @Value("${spring.application.name}")
    private String applicationName;

    public HomeController(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    @GetMapping("/")
    public String home(Model model) {
        Map<String, String> apiEndpoints = new HashMap<>();

        // Add your API endpoints and their descriptions
        apiEndpoints.put("/api/properties", "Property Management APIs Documentation: http://localhost:8081/api-docs");
        apiEndpoints.put("/api/users", "User Management and Auth APIs Documentation: http://localhost:8082/api-docs");
        apiEndpoints.put("/api/contact", "Contact APIs Documentation: http://localhost:8086/api-docs");
        apiEndpoints.put("/api/analytics", "Analytics APIs Documentation: http://localhost:8084/api-docs");
        // Add more endpoints as needed

        model.addAttribute("applicationName", applicationName);
        model.addAttribute("apiEndpoints", apiEndpoints);
        model.addAttribute("services", discoveryClient.getServices());

        return "index";
    }
}