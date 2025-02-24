package com.realestate.contact.actuator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.endpoint.annotation.Endpoint;
import org.springframework.boot.actuate.endpoint.annotation.ReadOperation;
import org.springframework.boot.actuate.health.Health;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Endpoint(id = "health-ui")
public class CustomHealthEndpoint {

    @Autowired
    private DetailedHealthIndicator healthIndicator;

    @ReadOperation(produces = MediaType.TEXT_HTML_VALUE)
    public String health() {
        Health health = healthIndicator.health();
        return generateHealthPage(health);
    }

    private String generateHealthPage(Health health) {
        StringBuilder html = new StringBuilder();
        html.append("""
            <!DOCTYPE html>
            <html>
            <head>
                <title>Service Health Status</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        margin: 20px;
                        background-color: #f5f5f5;
                    }
                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                        background-color: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 20px;
                        margin-bottom: 20px;
                    }
                    .status {
                        display: inline-block;
                        padding: 8px 16px;
                        border-radius: 4px;
                        color: white;
                        font-weight: bold;
                    }
                    .status-up {
                        background-color: #4CAF50;
                    }
                    .status-down {
                        background-color: #f44336;
                    }
                    .component {
                        border: 1px solid #ddd;
                        padding: 15px;
                        margin-bottom: 15px;
                        border-radius: 4px;
                    }
                    .component h3 {
                        margin-top: 0;
                        color: #333;
                    }
                    .detail-item {
                        margin: 5px 0;
                        padding: 5px;
                        background-color: #f9f9f9;
                    }
                    .timestamp {
                        text-align: center;
                        color: #666;
                        font-size: 0.9em;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Service Health Status</h1>
                        <div class="status %s">%s</div>
                    </div>
            """.formatted(
                health.getStatus().equals("UP") ? "status-up" : "status-down",
                health.getStatus()
        ));

        // Add components
        Map<String, Object> details = (Map<String, Object>) health.getDetails();
        details.forEach((component, componentDetails) -> {
            html.append("<div class=\"component\">");
            html.append("<h3>").append(component.toUpperCase()).append("</h3>");

            if (componentDetails instanceof Map) {
                Map<String, Object> detailsMap = (Map<String, Object>) componentDetails;
                detailsMap.forEach((key, value) -> {
                    html.append("<div class=\"detail-item\">");
                    html.append("<strong>").append(key).append(":</strong> ");
                    html.append(value);
                    html.append("</div>");
                });
            } else {
                html.append("<div class=\"detail-item\">").append(componentDetails).append("</div>");
            }

            html.append("</div>");
        });

        html.append("""
                    <div class="timestamp">
                        Last updated: %s
                    </div>
                </div>
            </body>
            </html>
        """.formatted(java.time.LocalDateTime.now()));

        return html.toString();
    }
}