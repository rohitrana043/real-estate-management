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
        apiEndpoints.put("/api/properties", "Property Management APIs");
        apiEndpoints.put("/api/users", "User Management and Auth APIs");
        apiEndpoints.put("/api/transactions", "Transactions APIs");
        apiEndpoints.put("/api/analytics", "Analytics APIs");
        // Add more endpoints as needed

        model.addAttribute("applicationName", applicationName);
        model.addAttribute("apiEndpoints", apiEndpoints);
        model.addAttribute("services", discoveryClient.getServices());

        return "index";
    }
}