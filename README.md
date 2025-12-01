# Employee Leave Management System

A leave management system where employees can apply for leaves and managers can approve or reject them. Built with React, Node.js, Express, and MongoDB.

## Features

### Employee Features
- Register and login with email
- Apply for leaves (Sick, Casual, Vacation)
- View leave balance for each type
- View all leave requests with status
- Cancel pending leave requests
- View dashboard with leave statistics
- View profile information
- See most used leave type breakdown
- Monthly leave summary insights
- Weekday patterns for leave usage

### Manager Features
- Login to manager portal
- View all pending leave requests
- Approve or reject leave requests
- Add manager comments when approving/rejecting
- View all employees' leave history
- View team dashboard with statistics
- See team leave load (today and this week)
- Detect leave overlaps in team

## Tech Stack

### Frontend
- **React** - User interface
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - API calls
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Server framework
- **MongoDB** - Database
- **Mongoose** - Database ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure
```
leave-management-system/
│
├── frontend/                              # React frontend application
│   ├── public/
│   │   └── index.html                    # HTML template
│   │
│   ├── src/
│   │   ├── pages/                        # Page components
│   │   │   ├── Login.jsx                 # Login page
│   │   │   ├── Register.jsx              # Registration page
│   │   │   ├── EmployeeDashboard.jsx     # Employee dashboard
│   │   │   ├── ManagerDashboard.jsx      # Manager dashboard
│   │   │   ├── ApplyLeave.jsx            # Apply leave form
│   │   │   ├── MyRequests.jsx            # View my requests
│   │   │   ├── PendingRequests.jsx       # Manager - pending requests
│   │   │   ├── AllRequests.jsx           # Manager - all requests
│   │   │   └── Profile.jsx               # User profile
│   │   │
│   │   ├── components/                   # Reusable components
│   │   │   └── Layout.jsx                # Navigation layout
│   │   │
│   │   ├── redux/                        # Redux state management
│   │   │   ├── store.js                  # Redux store
│   │   │   └── slices/                   # Redux slices
│   │   │       ├── authSlice.js          # Auth state
│   │   │       ├── leaveSlice.js         # Leave state
│   │   │       └── dashboardSlice.js     # Dashboard state
│   │   │
│   │   ├── styles/                       # CSS styles
│   │   │   ├── Auth.css                  # Login/Register styles
│   │   │   ├── Dashboard.css             # Dashboard styles
│   │   │   ├── Form.css                  # Form styles
│   │   │   ├── Layout.css                # Navigation styles
│   │   │   ├── Profile.css               # Profile styles
│   │   │   └── Requests.css              # Requests styles
│   │   │
│   │   ├── App.js                        # Main app component
│   │   └── index.js                      # App entry point
│   │
│   ├── package.json                      # Frontend dependencies
│   └── .env                              # Frontend environment variables
│
├── backend/                               # Node.js backend application
│   ├── models/                           # Database models
│   │   ├── User.js                       # User model
│   │   └── LeaveRequest.js               # Leave request model
│   │
│   ├── controllers/                      # Business logic
│   │   ├── authController.js             # Authentication logic
│   │   ├── leaveController.js            # Leave management logic
│   │   └── dashboardController.js        # Dashboard statistics
│   │
│   ├── routes/                           # API routes
│   │   ├── authRoutes.js                 # Auth endpoints
│   │   ├── leaveRoutes.js                # Leave endpoints
│   │   └── dashboardRoutes.js            # Dashboard endpoints
│   │
│   ├── middleware/                       # Custom middleware
│   │   └── authMiddleware.js             # JWT verification
│   │
│   ├── server.js                         # Express server
│   ├── package.json                      # Backend dependencies
│   └── .env                              # Backend environment variables
│
├── README.md                              # Project documentation
├── .env.example                          # Example environment file
└── DOCUMENTATION.md                      # Detailed documentation
```


## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Step 1: Clone or Download the Project

cd leave-management-system

### Step 2: Setup Backend

1. Navigate to backend folder
cd backend

2. Install dependencies
npm install

3. Create `.env` file (copy from `.env.example`)
MONGODB_URI=mongo_atlas_url
JWT_SECRET=your_jwt_secret_key
PORT=5000

4. Start the backend server
npm start

Backend runs on: `http://localhost:5000`

### Step 3: Setup Frontend

1. Open new terminal, navigate to frontend folder
cd frontend

2. Install dependencies
npm install

3. Create `.env` file (copy from `.env.example`)
REACT_APP_API_URL=http://localhost:5000/api

4. Start the frontend app
npm start

Frontend runs on: `http://localhost:3000`

## How to Use

### For Employees

1. **Register**: Click "Register" and create new account
2. **Login**: Login with your email and password
3. **Apply Leave**: Go to "Apply Leave" tab, select leave type, dates, and reason
4. **View Requests**: Go to "My Requests" to see all your leave applications
5. **Cancel Leave**: Cancel any pending leave request
6. **Dashboard**: View your leave balance and statistics

### For Managers

1. **Login**: Login with manager email and password
2. **Pending Requests**: Go to "Pending Requests" to see leave applications waiting for approval
3. **Approve/Reject**: Click on any request to approve or reject with comments
4. **View History**: Go to "All Requests" to see all employee leave history
5. **Dashboard**: View team statistics and leave loads

## Environment Variables

### Backend (.env)
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_for_jwt
PORT=5000
### Frontend (.env)
REACT_APP_API_URL=http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Leave Management (Employee)
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/my-requests` - Get my leave requests
- `DELETE /api/leaves/:id` - Cancel leave request
- `GET /api/leaves/balance` - Get leave balance

### Leave Management (Manager)
- `GET /api/leaves/all` - Get all leave requests
- `GET /api/leaves/pending` - Get pending requests
- `PUT /api/leaves/:id/approve` - Approve leave
- `PUT /api/leaves/:id/reject` - Reject leave

### Dashboard
- `GET /api/dashboard/employee` - Employee statistics
- `GET /api/dashboard/manager` - Manager/team statistics

## Database Schema

### User Model
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (employee/manager),
  leaveBalance: {
    sickLeave: Number,
    casualLeave: Number,
    vacation: Number
  },
  createdAt: Date
}

### LeaveRequest Model
{
  userId: ObjectId,
  leaveType: String (sick/casual/vacation),
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  reason: String,
  status: String (pending/approved/rejected),
  managerComment: String,
  createdAt: Date
}

## Testing

### Test Employee Account
- Email: employee@test.com
- Password: Test123!

### Test Manager Account
- Email: manager@test.com
- Password: Test123!

You can register new accounts and test the system.

## Troubleshooting

### Backend won't connect to MongoDB
- Check your MongoDB URI in `.env`
- Make sure IP is whitelisted in MongoDB Atlas
- Verify username and password

### Frontend can't connect to backend
- Check if backend is running on port 5000
- Verify `REACT_APP_API_URL` in frontend `.env`
- Check browser console for error messages

### Login not working
- Check if user exists in database
- Verify password is correct
- Check backend logs for errors

## Support

For issues or questions, check the code comments or review the backend API endpoints.

## License

This project is for educational purposes.
