package com.realestate.contact.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${spring.application.name}")
    private String applicationName;

    @Bean
    public OpenAPI contactServiceOpenAPI() {
        Server localServer = new Server()
                .url("http://localhost:8086")
                .description("Local Environment");

        Server devServer = new Server()
                .url("https://dev-api.yourdomain.com")
                .description("Development Environment");

        Contact contact = new Contact()
                .name("Real Estate Team")
                .email("support@yourdomain.com")
                .url("https://yourdomain.com");

        License license = new License()
                .name("Apache 2.0")
                .url("https://www.apache.org/licenses/LICENSE-2.0");

        Info info = new Info()
                .title(applicationName.toUpperCase() + " API Documentation")
                .version("1.0.0")
                .description("REST API documentation for the Contact Service - handles contact form submissions and newsletter subscriptions")
                .contact(contact)
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer, devServer));
    }
}