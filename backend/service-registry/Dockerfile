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
RUN mkdir -p ./api-gateway/src ./user-service/src ./property-service/src ./analytics-service/src ./contact-service/src

# Download dependencies for service-registry only
RUN mvn -B dependency:go-offline -DskipTests -pl service-registry -am

# Copy service-registry source code
COPY service-registry/src ./service-registry/src

# Build the service-registry module only
RUN mvn -B clean package -DskipTests -pl service-registry

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/service-registry/target/service-registry-1.0.0.jar app.jar

RUN mkdir -p /app/log
ENV LOG_PATH=/app/logs

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "-Dlogging.file.path=${LOG_PATH}", "-Dspring.profiles.active=prod", "app.jar"]