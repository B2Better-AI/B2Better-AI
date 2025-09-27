# Qwippo Frontend

A comprehensive B2B recommendation and marketplace platform frontend built with React.

## Features

- **Authentication**: Login, registration, and user management
- **Dashboard**: Analytics, statistics, and business insights
- **Retailer Directory**: Search and filter suppliers
- **User Profile**: Complete profile management
- **Settings**: Comprehensive user preferences
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Amazon-inspired design

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the `frontend/myapp` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Backend Connection

The frontend is now connected to the backend API with:

- **API Service Layer**: Centralized API calls
- **Authentication Context**: Global auth state management
- **Protected Routes**: Route protection based on auth status
- **Error Handling**: User-friendly error messages
- **Loading States**: Loading indicators for better UX

## API Integration

### Authentication
- User registration and login
- JWT token management
- Profile updates and preferences
- Password changes and account management

### Dashboard
- Business statistics and analytics
- Recent orders and activity
- AI-powered recommendations
- Market insights

### Retailers
- Supplier search and filtering
- Detailed retailer profiles
- Review and rating system
- Product catalogs

### Orders
- Order creation and management
- Status tracking and updates
- Order history and statistics

## Components

- **AuthContext**: Global authentication state
- **ApiService**: Centralized API communication
- **ProtectedRoute**: Route protection wrapper
- **Login/Signup**: Authentication forms
- **Dashboard**: Business analytics
- **Retailers**: Supplier directory
- **UserProfile**: Profile management
- **Settings**: User preferences

## Styling

- **CSS Modules**: Component-specific styling
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional design
- **Loading States**: User feedback
- **Error Handling**: Visual error messages

## Development

- **React Hooks**: Modern React patterns
- **Context API**: Global state management
- **React Router**: Client-side routing
- **Fetch API**: HTTP requests
- **Local Storage**: Token persistence

## Production Build

```bash
npm run build
```

## Backend Requirements

Make sure the backend server is running on `http://localhost:5000` with:
- MongoDB Atlas connection
- JWT authentication
- CORS enabled for frontend
- All API endpoints available