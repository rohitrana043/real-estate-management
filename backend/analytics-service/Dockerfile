# backend/analytics-service/Dockerfile
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy the parent POM first
COPY pom.xml .

# Copy all module POMs (but not their contents yet)
COPY service-registry/pom.xml ./service-registry/
COPY api-gateway/pom.xml ./api-gateway/
COPY user-service/pom.xml ./user-service/
COPY property-service/pom.xml ./property-service/
COPY analytics-service/pom.xml ./analytics-service/
COPY contact-service/pom.xml ./contact-service/

# Create empty src directories to satisfy Maven
RUN mkdir -p ./service-registry/src ./api-gateway/src ./user-service/src ./property-service/src ./contact-service/src

# Download dependencies for analytics-service only
RUN mvn -B dependency:go-offline -DskipTests -pl analytics-service -am

# Copy analytics-service source code
COPY analytics-service/src ./analytics-service/src

# Build the analytics-service module only
RUN mvn -B clean package -DskipTests -pl analytics-service

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/analytics-service/target/analytics-service-1.0.0.jar app.jar

RUN mkdir -p /app/log
ENV LOG_PATH=/app/logs

EXPOSE 8084

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8084/actuator/health || exit 1

# Add memory constraints and exit on OOM
ENTRYPOINT ["java", "-Xms512m", "-Xmx1024m", "-XX:+ExitOnOutOfMemoryError", "-jar", "-Dlogging.file.path=${LOG_PATH}", "-Dspring.profiles.active=prod", "app.jar"]