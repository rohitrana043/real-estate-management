FROM openjdk:17-slim
LABEL maintainer="rohit.rana043@gmail.com"

# Add application user
RUN useradd -ms /bin/bash eureka

# Set working directory
WORKDIR /app

# Copy application jar
COPY target/service-registry.jar app.jar

# Set permissions
RUN chown -R eureka:eureka /app
USER eureka

# Expose ports
EXPOSE 8761

# Set entry point
ENTRYPOINT ["java", \
            "-Djava.security.egd=file:/dev/./urandom", \
            "-jar", \
            "/app/app.jar"]