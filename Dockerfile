# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the application code
COPY src ./src

# Build the Spring Boot application
RUN mvn package -DskipTests

# Stage 2: Create the final, lean image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the executable JAR file from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8083

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
