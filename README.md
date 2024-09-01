# Syncify

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://syncify-pink.vercel.app/)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)

## Introduction

**Syncify** is a web application designed for efficient project management, combining task tracking, real-time communication, and collaboration features. Whether you're working solo or with a team, Syncify helps keep your projects organized and on track.

[Live Demo](https://syncify-pink.vercel.app/)

## Features

- **Task Management**: Create, update, and manage tasks with a Kanban board view.
- **Real-Time Chat**: Communicate with team members instantly within the project.
- **Project Overview**: Get a snapshot of project details, including task counts and progress.
- **Customizable Settings**: Toggle themes and manage your account effortlessly.
- **Responsive Design**: Seamlessly use Syncify on any device, thanks to the responsive UI.

## Tech Stack

### Frontend

- **React** with **Vite**: For a fast and modern frontend development experience.
- **Tailwind CSS**: Ensures a responsive and attractive design with minimal effort.
- **Redux** & **Context API**: Used for managing state across the application.
- **Lucide Icons**: Simple and customizable icon library.
- **Shadcn** & **Radix UI**: Enhancing UI components for a better user experience.

### Backend

- **Firebase**: Manages authentication, real-time database, and cloud storage.
- **Socket.IO**: Powers the real-time chat functionality, enabling instant communication.

## Installation

To get a local copy up and running, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/AdiShukla06/syncify.git
   cd syncify

2. **Install Dependencies:**

    Make sure you have Node.js and npm installed.

  ```bash
  npm install
  ```

3. **Set Up Firebase:**

   *Create a Firebase project and add your web app.
   *Obtain your Firebase config object and replace the placeholders in src/firebaseConfig.js.
   *Enable Firebase Authentication and Firestore in the Firebase console.  

4. **Run the Application:**

  ```bash
  npm run dev
  ```

The app should now be running on http://localhost:3000.

## Usage
*Login/Signup: Create an account or log in using your credentials.
*Create/Join Project: Start a new project or join an existing one from the ChooseProjectPage.
*Manage Tasks: Use the Kanban board to create, update, and track tasks.
*Communicate: Use the real-time chat to stay connected with your team.
*Customize Settings: Access the settings page to toggle themes or delete your account.

## Contributing
Contributions are welcome! If you'd like to contribute to Syncify, please follow these steps:

1. Fork the repository.
2. Create your feature branch (git checkout -b feature/AmazingFeature).
3. Commit your changes (git commit -m 'Add some AmazingFeature').
4. Push to the branch (git push origin feature/AmazingFeature).
5. Open a Pull Request.

## If you have any questions or feedback, feel free to reach out:

GitHub: AdiShukla06
LinkedIn: Aditya Shukla
