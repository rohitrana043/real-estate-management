FROM eclipse-temurin:17-jdk-alpine
LABEL maintainer="rohit.rana043@gmail.com"
# Add application user
RUN useradd -ms /bin/bash eureka
# Set working directory
WORKDIR /app
# Copy application jar
COPY target/*.jar app.jar
# Set permissions
RUN chown -R eureka:eureka /app
# Set Env Variable
ENV SPRING_PROFILES_ACTIVE=prod
# Expose ports
EXPOSE 8084
# Set entry point
ENTRYPOINT ["java", "-jar", "app.jar"]