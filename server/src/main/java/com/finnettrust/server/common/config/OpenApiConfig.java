package com.finnettrust.server.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

/**
 * Customizes Swagger UI metadata.
 */
@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI finnetOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Finnet Blog Dashboard API")
                .description("REST API for the User Dashboard & Post Manager assessment.")
                .version("v1"));
    }
}
