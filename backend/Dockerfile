# backend/Dockerfile
# This is a base Dockerfile that will be used by all services
# It handles the multi-module Maven project structure

FROM maven:3.8.6-openjdk-17 AS builder
WORKDIR /app

# Copy the parent POM first
COPY pom.xml .

# Copy all module POMs (but not their contents yet)
COPY service-registry/pom.xml service-registry/
COPY api-gateway/pom.xml api-gateway/
COPY user-service/pom.xml user-service/
COPY property-service/pom.xml property-service/
COPY analytics-service/pom.xml analytics-service/
COPY contact-service/pom.xml contact-service/

# Download dependencies only (this layer can be cached)
RUN mvn -B dependency:go-offline -DskipTests

# Copy the source code for all modules
COPY service-registry/src service-registry/src
COPY api-gateway/src api-gateway/src
COPY user-service/src user-service/src
COPY property-service/src property-service/src
COPY analytics-service/src analytics-service/src
COPY contact-service/src contact-service/src

# This is a placeholder - the actual build command will be specified in each service's Dockerfile