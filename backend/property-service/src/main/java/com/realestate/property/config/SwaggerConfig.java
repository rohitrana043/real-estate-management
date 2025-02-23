package com.realestate.property.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${spring.application.name:Property Service}")
    private String applicationName;

    @Bean
    public OpenAPI propertyServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Property Service API Documentation")
                        .description("RESTful API documentation for Property Management Service. " +
                                "This service provides endpoints for managing real estate properties and their images.")
                        .version("1.0")
                        .contact(new Contact()
                                .name("Real Estate Support")
                                .email("support@realestate.com")
                                .url("https://realestate.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8081")
                                .description("Local Development Server")
                ))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT token authentication")))
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"))
                .tags(List.of(
                        new Tag()
                                .name("Property")
                                .description("Property management operations"),
                        new Tag()
                                .name("Property Images")
                                .description("Property image management operations")
                ));
    }
}