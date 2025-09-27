# Qwippo Backend API

A comprehensive B2B recommendation and marketplace platform backend built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Complete user profiles with preferences and settings
- **Retailer/Supplier Directory**: Search, filter, and manage suppliers
- **Order Management**: Full order lifecycle management
- **Dashboard Analytics**: Business insights and statistics
- **Activity Tracking**: User activity logging and monitoring
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database**: MongoDB with Mongoose ODM

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /profile` - Update user profile
- `PUT /preferences` - Update user preferences
- `PUT /password` - Change password
- `POST /logout` - User logout
- `DELETE /account` - Delete user account

### Dashboard (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics
- `GET /recent-orders` - Get recent orders
- `GET /recommendations` - Get AI recommendations
- `GET /insights` - Get market insights
- `GET /activity` - Get user activity

### Retailers (`/api/retailers`)
- `GET /` - Get all retailers with search/filters
- `GET /:id` - Get single retailer
- `POST /:id/reviews` - Add review to retailer
- `GET /:id/reviews` - Get retailer reviews
- `GET /:id/products` - Get retailer products
- `GET /meta/categories` - Get categories for filtering

### Orders (`/api/orders`)
- `GET /` - Get user orders
- `GET /:id` - Get single order
- `POST /` - Create new order
- `PUT /:id/status` - Update order status
- `PUT /:id/cancel` - Cancel order
- `GET /stats/overview` - Get order statistics

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/qwippo
DB_NAME=qwippo

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# API Keys (for future integrations)
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## Database Models

### User
- Profile information (name, email, company, position)
- Preferences (notifications, privacy, general settings)
- Statistics (total orders, total spent, join date)
- Authentication data

### Retailer
- Business information (name, description, category)
- Contact details (email, phone, location)
- Rating and reviews system
- Product catalog
- Verification status

### Order
- Order details (items, pricing, shipping)
- Status tracking with timeline
- Payment information
- User and retailer references

### Product
- Product information (name, description, SKU)
- Pricing and inventory
- Rating and reviews
- Category and specifications

### Activity
- User activity tracking
- Action logging with metadata
- Related entity references

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Input Validation**: express-validator for request validation
- **Rate Limiting**: Prevent abuse and DDoS attacks
- **CORS**: Configured for frontend communication
- **Helmet**: Security headers
- **Data Sanitization**: Prevent NoSQL injection

## Error Handling

- Global error handler with proper HTTP status codes
- Validation error handling
- Database error handling
- JWT error handling
- Custom error messages

## API Response Format

All API responses follow this format:

```json
{
  "success": true/false,
  "message": "Response message",
  "data": {}, // Response data (if any)
  "errors": [] // Validation errors (if any)
}
```

## Development

- **nodemon**: Auto-restart on file changes
- **morgan**: HTTP request logging
- **compression**: Response compression
- **ESLint**: Code linting (if configured)

## Production Considerations

- Use environment variables for sensitive data
- Set up proper logging
- Configure rate limiting appropriately
- Use HTTPS in production
- Set up monitoring and alerting
- Regular database backups
- Implement proper error tracking

## Testing

```bash
npm test
```

## License

MIT
