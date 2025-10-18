# Student Management System

This project is a full-stack student management system application developed using Spring Boot (backend) and React (frontend). The entire application is containerized with Docker, making setup and execution straightforward.

## Features

- Add, delete, update, and list students
- User registration and login (JWT-based authentication)
- Role-based authorization (Admin, User)
- Modern and responsive user interface

## Quick Start

To run this project on your local machine, you need to have [Docker](https://www.docker.com/get-started) and `docker-compose` installed.

1.  Clone the project:
    ```bash
    git clone https://github.com/leventoner/school.git
    cd school
    ```

2.  Start the application:
    ```bash
    docker-compose up --build
    ```

3.  Access the application:
  - **Frontend:** `http://localhost:3000`
  - **Backend API:** `http://localhost:8083`

## Detailed Documentation

For detailed information about the project's architecture, technologies used, API endpoints, and more, please refer to the documentation file below:

- **[Project Documentation](./documentation/documentation.md)**
