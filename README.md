# Country Explorer Application

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

## 📋 Overview

Country Explorer is an interactive full-stack web application that allows users to explore information about countries around the world. The application features user authentication, favorites management, country search and filtering, responsive design, and theme customization.

## ✨ Features

- **User Authentication** - Register, login, and manage user profiles
- **Google OAuth Integration** - Sign in with Google accounts
- **Country Cards** - Browse through countries with visually appealing cards
- **Favorites System** - Save your favorite countries for quick access
- **Country Details** - View comprehensive information about each country
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark Mode Support** - Choose between light and dark themes
- **Persistent Storage** - User preferences and favorites are saved between sessions
- **Search & Filter** - Find countries by name or filter by region
- **Profile Management** - Update profile information and upload profile pictures

## 🛠️ Technology Stack

### Frontend
- **Framework**: React with Vite
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: Tailwind CSS with Flowbite components
- **Routing**: React Router v6
- **Authentication**: Firebase Authentication
- **Storage**: Firebase Storage (for profile images)
- **Notifications**: React Toastify
- **Icons**: React Icons (Heroicons)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt for password hashing
- **Environment Variables**: dotenv

## 📦 Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB (local instance or Atlas URI)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory
```bash
cd country-explorer-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the backend server
```bash
npm start
```
For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory
```bash
cd country-explorer
```

2. Install dependencies
```bash
npm install
```

3. Create a Firebase project and add configuration to `firebase.js`

4. Create a `.env` file with necessary variables:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

5. Start the development server
```bash
npm run dev
```

## 🧪 Testing

### Backend Tests
Run the backend tests with:
```bash
cd country-explorer-backend
npm test
```

### Frontend Tests (Cypress)
To run Cypress tests:
```bash
cd country-explorer
npm run cypress:open
```

This will open the Cypress Test Runner, where you can select and run individual test files.

## 🔍 Usage Guide

### Authentication
- Create an account using email and password
- Alternatively, sign in with your Google account
- Update your profile information and upload a profile picture

### Home Page
- Browse country cards in grid view
- Search for countries by name
- Filter countries by region
- Toggle between light and dark themes

### Country Details
- Click on any country card to view detailed information
- Toggle favorite status by clicking the heart icon
- View geographical, demographic, and economic data

### Favorites
- Access your saved favorite countries
- Remove countries from favorites
- Clear all favorites at once

### Profile Dashboard
- Update username and other profile information
- Change your password
- Upload a new profile picture
- Delete your account if needed

## 📚 Project Structure

```
country-explorer/
├── public/
├── src/
│   ├── components/
│   │   ├── country-details/       # Country detail related components
│   │   ├── header/                # Header and navigation components
│   │   └── LoadingSpinner.jsx     # Loading indicator
│   ├── pages/
│   │   ├── Home.jsx              # Home page with country listing
│   │   ├── CountryDetail.jsx     # Country details page
│   │   ├── Favorites.jsx         # User's favorite countries
│   │   ├── SignIn.jsx            # User authentication
│   │   ├── SignUp.jsx            # User registration
│   │   └── Dashboard.jsx         # User profile management
│   ├── redux/                    # Redux state management
│   │   ├── user/                 # User state slice
│   │   ├── favorites/            # Favorites state slice
│   │   └── themeSlice.js         # Theme state management
│   ├── service/
│   │   ├── api.js                # Country API interaction
│   │   └── authService.js        # Authentication services
│   ├── store/
│   │   └── store.js              # Redux store configuration
│   ├── utils/                    # Utility functions
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Entry point with Redux Provider
│   └── index.css                 # Global styles
└── package.json                  # Dependencies and scripts

country-explorer-backend/
├── controller/                   # Route controllers
├── models/                       # MongoDB schemas
├── routes/                       # API routes
├── utils/                        # Utility functions
├── index.js                      # Server entry point
└── package.json                  # Dependencies and scripts
```

## 🌐 API Integration

The application uses:
1. Custom backend API for user management
2. REST Countries API for country data:
   - Base endpoint: https://restcountries.com/v3.1/
   - All countries: `/all`
   - Country by code: `/alpha/{code}`

## 🔐 Authentication Flow

1. **Registration**: User information is stored in MongoDB with password hashing
2. **Login**: Authentication uses JWT tokens
3. **Google OAuth**: Integration with Firebase Authentication
4. **Session Management**: Redux Persist maintains user session

## 🙏 Acknowledgments

- REST Countries API for providing country data
- Flowbite React for UI components
- Tailwind CSS for styling
- React Router for navigation
- Firebase for authentication and storage
- MongoDB for database
- Express for backend API

## 📄 License

This project is part of an academic assignment and is subject to the policies of the educational institution.

---

## 👨‍💻 Developer

- IT22323934 - Asiri Jayawardena