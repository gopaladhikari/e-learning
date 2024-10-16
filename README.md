# E-learning

This repository contains the backend code for an E-Learning Platform built using Node.js and Express. It provides functionality for managing course uploads by teachers, student enrollments, and caching for improved performance.

## Features

- Teacher Uploads: Teachers can upload courses including course details and content.

- Student Enrollment: Students can browse available courses and enroll in the ones they are interested in.

- Caching: To improve performance, a simple caching system is implemented using node-cache for frequently accessed data.

- Single Seller: The platform supports only one teacher/seller to upload and manage courses.

## Tech Stack

- Backend Framework: Node.js with Express.js
- Database: MongoDB
- Caching: node-cache for in-memory caching
- Authentication: JSON Web Tokens (JWT) for secure access and authorization.
- Validation: zod for input validation.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue if you encounter any bugs or have feature requests.

## LICENSE

License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/gopaladhikari/e-learning?tab=MIT-1-ov-file) file for details.
