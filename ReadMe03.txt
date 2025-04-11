======================================================
GYMFLEX - GYM MANAGEMENT SYSTEM
======================================================

INSTALLATION AND RUNNING INSTRUCTIONS
------------------------------------------------------

PREREQUISITES:
1. **Node.js** must be installed on your computer
   - Download from https://nodejs.org/
   - Install the **LTS (Long Term Support)** version

2. **Java JDK 17 or higher** must be installed for Spring Boot to run
   - Download from https://adoptium.net/ or https://www.oracle.com/java/technologies/javase-downloads.html

3. **MySQL Server** must be installed and running
   - Download from https://dev.mysql.com/downloads/mysql/

------------------------------------------------------
FRONTEND INSTALLATION (React)
------------------------------------------------------
1. Extract all project files to a folder on your computer

2. Open **Command Prompt (Windows)** or **Terminal (Mac/Linux)**

3. Navigate to the frontend project folder:
   cd path/to/project/frontend

4. Install all required dependencies:
   npm install
   (This will take some time as it downloads all necessary packages)

5. Run the React application:
   npm start

6. The application will automatically open in your default web browser

7. If it doesn't open automatically, navigate to:
   http://localhost:3000

------------------------------------------------------
BACKEND INSTALLATION (Spring Boot)
------------------------------------------------------
1. Open **Command Prompt (Windows)** or **Terminal (Mac/Linux)**

2. Navigate to the backend project folder:
   cd path/to/project/backend

3. Run the Spring Boot application using the Maven wrapper:
   mvnw spring-boot:run      (Windows)
   ./mvnw spring-boot:run    (Mac/Linux)

4. The backend will start on:
   http://localhost:8080

NOTE:
- Make sure MySQL is running and the `gym_flex` database is correctly set up

------------------------------------------------------
DATABASE SETUP (MySQL)
------------------------------------------------------
1. Open your MySQL client (e.g., MySQL Workbench or command-line)

2. Create a new database:
   CREATE DATABASE gym_flex;

3. Import the `gym_flex.sql` file into the `gym_flex` database:
   - Using command-line:
     mysql -u your_username -p gym_flex < path/to/gym_flex.sql

   - Or using MySQL Workbench:
     - Open the `gym_flex.sql` file
     - Select the `gym_flex` schema
     - Run the SQL script

4. Make sure your Spring Boot application's database settings (in `application.properties` or `application.yml`) match your MySQL setup

------------------------------------------------------
NOTES:
- The `node_modules` folder is not included in the deliverable files
- The `npm install` command will create this folder and download all dependencies
- The backend uses the Maven wrapper (`mvnw`), so Maven does not need to be installed separately
- An internet connection is required for downloading dependencies
