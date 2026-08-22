# Dayflow – Human Resource Management System

Dayflow is a Human Resource Management System (HRMS) designed to simplify and manage essential employee and HR operations through a centralized web application.

This repository contains the **backend** of the Dayflow HRMS application, developed using **Spring Boot** and connected to a **MySQL database**.

## 🚀 Project Overview

Dayflow HRMS provides backend APIs and services for managing HR-related operations such as:

* Employee management
* Employee profiles
* Attendance management
* Leave management
* Department and job information
* User authentication and authorization
* HR and employee role-based operations
* Payroll-related information
* HR dashboard data

The backend provides REST APIs that can be consumed by the Dayflow frontend.

## 🛠️ Technologies Used

* **Java 17**
* **Spring Boot**
* **Spring Web / REST API**
* **Spring Data JPA**
* **Hibernate**
* **MySQL**
* **Maven**
* **XAMPP** – used for local MySQL database management
* **IntelliJ IDEA**

## 📁 Project Structure

```text
hrms/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ...
│   │   └── resources/
│   │       ├── application.properties
│   │       └── ...
│   └── test/
│
├── pom.xml
└── README.md
```

## 💻 Prerequisites

Before running the backend, make sure you have installed:

* Java JDK 17
* Maven
* MySQL
* XAMPP
* IntelliJ IDEA or another Java IDE
* Git

## 🗄️ Database Setup

The project uses **MySQL** as its database.

XAMPP can be used to run the local MySQL server.

### Start MySQL using XAMPP

1. Open **XAMPP Control Panel**.
2. Start **MySQL**.
3. Open phpMyAdmin.
4. Create the database required by the application.

Example:

```sql
CREATE DATABASE dayflow_hrms;
```

Configure the database connection in:

```text
src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dayflow_hrms
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

> Do not commit real database passwords or other secrets to GitHub.

## ▶️ Running the Backend

### Using IntelliJ IDEA

1. Open the `hrms` project in IntelliJ IDEA.
2. Make sure Java 17 is configured.
3. Make sure MySQL is running through XAMPP.
4. Verify the database configuration.
5. Run the Spring Boot main application class.

### Using Maven

From the project directory:

```bash
mvn spring-boot:run
```

The backend will start on the configured server port.

For example:

```text
http://localhost:8080
```

## 🔗 Frontend Integration

The Dayflow frontend communicates with this backend through REST APIs.

The frontend should use the backend base URL:

```text
http://localhost:8080
```

API endpoints can then be accessed using paths defined by the backend controllers.

Example:

```text
GET    /api/employees
POST   /api/employees
PUT    /api/employees/{id}
DELETE /api/employees/{id}
```

> The exact endpoints depend on the controllers implemented in the project.

## 🔐 Security

The application is designed to support role-based access for different users such as:

* Admin
* HR
* Employee

Sensitive configuration values should be stored using environment variables or local configuration files rather than committing them to the repository.

## 🧪 Testing

To run the backend tests:

```bash
mvn test
```

## 📦 Build

To create the backend JAR:

```bash
mvn clean package
```

The generated JAR will be available inside:

```text
target/
```

## 🌐 CORS

When connecting the Dayflow frontend to the backend during local development, configure CORS to allow requests from the frontend development server.

For example, if the frontend runs on:

```text
http://localhost:3000
```

or

```text
http://localhost:5173
```

the backend should allow the appropriate frontend origin.

## 🔄 Development Workflow

```text
Dayflow Frontend
       |
       | REST API
       ↓
Dayflow Spring Boot Backend
       |
       | JPA / Hibernate
       ↓
MySQL Database
       ↑
       |
     XAMPP
```

## 📌 Current Setup

The current development environment uses:

* **Backend:** Spring Boot
* **Java:** JDK 17
* **Database:** MySQL
* **Database Server:** XAMPP
* **IDE:** IntelliJ IDEA
* **Frontend:** Separate Dayflow HRMS frontend
* **API Communication:** REST APIs

## 👩‍💻 Project

**Project Name:** Dayflow – Human Resource Management System

**Repository:** Dayflow HRMS Backend

This backend is part of the complete Dayflow HRMS application and is intended to work together with the Dayflow frontend.

## 📄 License

This project is developed for educational/project purposes.

