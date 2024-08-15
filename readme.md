# Problem Statement: Phone Book Application

## Description

A Phone Book application using Node.js and Express.js. This application will allow users to manage their contacts by adding, viewing, editing, and deleting contact information. The application will include secure authentication features such as login and signup, with passwords stored in an encrypted format. Data for users and contacts will be stored in separate files, and you may choose to use either Excel or JSON for storage. The application will also allow users to upload a photo for each contact using `multer` for file handling.

### Backend

- An Express.js server to handle HTTP requests and serve the API.
- Separate files to store user and contact information.
  - User data is stored in `users.json`file.
  - Contact data is stored in `contacts.json` file.
- API endpoints:
  - **POST** `/api/auth/signup` - Registering new user with username and password. password is hashed using bcrypt and then only the hash is stored and also creating a jwt web token with 1 year expiry and send it as in response along with id and username.
  - **POST** `/api/auth/login` - Authenticating user and return a JWT token same way.
  - **GET** `/api/contacts` - Retrieveing all contacts for the authenticated user.
  - **GET** `/api/contacts/:id` - Retrieveing a specific contact by ID for the authenticated user.
  - **POST** `/api/contacts` - Creates a new contact for the authenticated user. Each contact should include:
    - Name
    - Phone number
    - Email address
    - Photo (uploaded using `multer` and stored on the server or as a URL)
  - **PUT** `/api/contacts/:id` - Update an existing contact by ID for the authenticated user.
  - **DELETE** `/api/contacts/:id` - Delete a specific contact by ID for the authenticated user.

### Data Management

- Store user data and contact information in separate files (`users.json` or `users.xlsx` for users, and `contacts.json` or `contacts.xlsx` for contacts).
- Generate unique IDs for users and contacts using a simple incrementing counter or UUID.

### File Handling

- Use `multer` to handle photo uploads when creating or updating a contact.
- Store uploaded photos in a designated folder on the server, and save the file path or URL in the contact's data.

### Security

- Implement password encryption using `bcrypt` or a similar library.
- Use JWT for session management and protecting routes that require authentication.

### Validation

- Use Joi for validating incoming data to ensure it meets the expected formats and constraints.
  - **User Registration**:
    - Validate that the username is a string and is required.
    - Validate that the password is a string, has a minimum length, and is required.
    - Validate that the email is a valid email format and is required.
  - **User Login**:
    - Validate that the username is a string and is required.
    - Validate that the password is a string and is required.
  - **Contact Management**:
    - Validate that the name is a string and is required.
    - Validate that the phone number is a string, has a valid phone number format, and is required.
    - Validate that the email is a valid email format and is required.
    - Validate that the photo is an optional file upload, if included.

### Frontend UI (Optional)

- You are free to use any frontend technology or framework of your choice to build the user interface for the application. This may include React or even plain HTML/CSS/JavaScript.
- The frontend should interact with the backend API to perform CRUD operations on contacts and handle user authentication.

## Guidelines

- Use Node.js and Express.js to build the backend API.
- Ensure secure password storage and implement JWT-based authentication.
- Implement viewing, editing, and deleting functionality for individual contacts, ensuring that each contact includes a name, phone number, email, and photo.
- Write clean, modular code with appropriate error handling and validation.
  Submission of Frontend Internship Task