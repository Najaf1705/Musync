### Description
This repository contains the code for the project. It is built using MERN and includes various dependencies for authentication, UI components, testing, and more.

### Prerequisites
- Node.js (v18.2.0 recommended)
- npm (v8.5.0 recommended)

### Installation
1. Clone the repository: `git clone https://github.com/Najaf1705/Musync.git`
2. Install dependencies: `npm install`

### Client

### Configuration
- Proxy: The client is configured to proxy requests to `http://localhost:"backend-port"`. Make sure your backend server is running on this address.

### Dependencies
- **@auth0/auth0-react:** Authentication library for React.
- **@headlessui/react:** UI component library for React.
- **@react-oauth/google:** Google OAuth library for React.
- **@testing-library/jest-dom:** Jest DOM utilities for testing.
- **@testing-library/react:** Testing utilities for React.
- **@testing-library/user-event:** User events utilities for testing.
- **bootstrap:** CSS framework for styling.
- **jwt-decode:** JWT decoding library.
- **react:** React library.
- **react-color-extractor:** Color extraction library for React.
- **react-dom:** React DOM library.
- **react-loading-skeleton:** Loading skeleton component for React.
- **react-router-dom:** Routing library for React.
- **react-scripts:** Scripts for React projects.
- **react-toastify:** Toast notifications for React.
- **web-vitals:** Library for tracking web vital metrics.

### Scripts
- **start:** Start the development server with the legacy OpenSSL provider.
- **build:** Build the production-ready application.
- **test:** Run tests using Jest.
- **eject:** Eject from create-react-app configuration.

### ESLint Configuration
The project follows the ESLint configuration provided by create-react-app, extending both "react-app" and "react-app/jest" configurations.

### Browserslist
- **Production:** Targets browsers with more than 0.2% market share, excluding dead browsers and Opera Mini.
- **Development:** Targets the last version of Chrome, Firefox, and Safari.

### Usage
- For development: `npm start`
- For production build: `npm run build`
- For testing: `npm test`

### Notes
- This project is configured to work with a backend server running on `http://localhost:"backend-port"`. Adjust the proxy setting in `package.json` if needed.
- Make sure to configure environment variables or replace placeholder values as needed for your specific use case.

### Create .env file in frontend folder
- REACT_APP_YOUTUBE_KEY2="Youtube API key"
- REACT_APP_RAPID_KEY="Rapid API key for audio download"
- REACT_APP_SPOTIFY_CLIENT_ID="Spotify client id"
- REACT_APP_SPOTIFY_CLIENT_SECRET="Spotify client secret"
- REACT_APP_GOOGLE_CLIENT_ID="Google client id"
- REACT_APP_GOOGLE_CLIENT_SECRET="Google client secret"


# Server

[![License](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Description

This is the server component of the application, version 1.0.0.

## Usage

### Running the Server

#### Start the server in development mode with nodemon for automatic restarts
npm run dev

### Dependencies
- **bcryptjs:** Library for hashing passwords.
- **cookie-parser:** Parse HTTP request cookies.
- **cors:** Middleware for enabling CORS in Express.
- **dotenv:** Loads environment variables from a .env file.
- **express:** Web application framework for Node.js.
- **jsonwebtoken:** JSON Web Token (JWT) implementation.
- **mongoose:** MongoDB object modeling for Node.js.
- **node-fetch:** A light-weight module for making HTTP requests.
- **pickle:** Library for object serialization in Node.js.
- **picklejs:** Another library for object serialization.
- **python-shell:** Run Python scripts from Node.js.

### Development Dependencies
- **nodemon:** Monitor for any changes in your Node.js application and automatically restart the server.

### Create config.env file in backend folder
- DATABASE="Your mongoDB connection string"
- PORT=5000
- SECRET_KEY=QWERTYUIOPLKJHGFDSAZXCVBNMQWERTYUIOP
- SPOTIFY_CLIENT_ID="Spotify client id"
- SPOTIFY_CLIENT_SECRET="Spotify client secret"


### Author
Your Name <najafshaikh1705@gmail.com>

Feel free to reach out for any questions or issues!