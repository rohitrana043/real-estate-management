package com.realestate.property.config;

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
public class SwaggerConfig {

    @Value("${spring.application.name:Property Service}")
    private String applicationName;

    @Bean
    public OpenAPI propertyServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title(applicationName + " API Documentation")
                        .description("RESTful API documentation for Property Management Service")
                        .version("1.0")
                        .contact(new Contact()
                                .name("Development Team")
                                .email("dev-team@example.com")
                                .url("https://example.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .servers(List.of(
                        new Server()
                                .url("/")
                                .description("Default Server URL")
                ));
    }
}