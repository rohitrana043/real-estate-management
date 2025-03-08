# backend/property-service/Dockerfile
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
RUN mkdir -p ./service-registry/src ./api-gateway/src ./user-service/src ./analytics-service/src ./contact-service/src

# Download dependencies for property-service only
RUN mvn -B dependency:go-offline -DskipTests -pl property-service -am

# Copy property-service source code
COPY property-service/src ./property-service/src

# Build the property-service module only
RUN mvn -B clean package -DskipTests -pl property-service

FROM eclipse-temurin:17-jre
WORKDIR /app

RUN mkdir -p /app/logs

# Add non-root user
RUN addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 --gid 1001 appuser && \
    chown -R appuser:appuser /app/logs

# Copy JAR file from builder stage
COPY --from=builder /app/property-service/target/property-service-1.0.0.jar app.jar

# Set proper permissions
RUN chown -R appuser:appuser /app
USER appuser


# Set memory limits for JVM
ENV JAVA_OPTS="-XX:MinRAMPercentage=60.0 -XX:MaxRAMPercentage=80.0 -Djava.security.egd=file:/dev/./urandom"
ENV LOG_PATH=/app/logs

# Add health check 
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 CMD -f curl http://localhost:8081/actuator/health || exit 1

EXPOSE 8081
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS} -Dspring.profiles.active=prod -Dlogging.file.path=${LOG_PATH} -jar app.jar"]