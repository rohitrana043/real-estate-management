package com.realestate.analytics.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Real Estate Analytics API",
                version = "1.0",
                description = "REST API for Real Estate Analytics and Property Trends",
                contact = @Contact(
                        name = "Real Estate Analytics Team",
                        email = "info@realestate.com",
                        url = "https://www.realestate.com"
                ),
                license = @License(
                        name = "MIT License",
                        url = "https://choosealicense.com/licenses/mit/"
                )
        ),
        servers = {
                @Server(
                        url = "http://localhost:8080",
                        description = "Development Server"
                ),
                @Server(
                        url = "https://api.realestate.com",
                        description = "Production Server"
                )
        },
        security = @SecurityRequirement(name = "bearer-key")
)
@SecurityScheme(
        name = "bearer-key",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER,
        description = "JWT token authentication"
)
public class SwaggerConfig {
    // Configuration is handled through annotations
}