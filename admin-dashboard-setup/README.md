# FolioXe Admin Dashboard

A standalone admin dashboard for managing your FolioXe website. This dashboard connects to the same Firebase project as your main FolioXe application and provides comprehensive administrative controls.

## 🚀 Features

- **🔐 Secure Authentication**: Admin-only access with role-based permissions
- **👥 User Management**: View, edit roles, ban/unban users
- **📦 Product Management**: Approve/reject products, view details
- **⭐ Review Management**: Moderate user reviews
- **📊 Analytics**: Real-time statistics and insights
- **⚙️ Settings**: System configuration and security options
- **🌙 Dark/Light Mode**: Toggle between themes
- **📱 Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Copy your Firebase configuration from your main FolioXe project
2. Update `src/firebase.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Set Up Admin User

1. Go to your Firebase Console
2. Navigate to Firestore Database → `users` collection
3. Find your user document or create one
4. Set the `role` field to `"admin"`

### 4. Start Development Server

```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Top navigation bar
│   ├── Sidebar.jsx     # Side navigation menu
│   └── ProtectedRoute.jsx # Authentication guard
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Authentication state
│   └── ThemeContext.jsx # Dark/light mode
├── pages/              # Page components
│   ├── LoginPage.jsx   # Admin login
│   ├── Dashboard.jsx   # Main dashboard layout
│   └── sections/       # Dashboard sections
│       ├── Overview.jsx    # Dashboard overview
│       ├── Users.jsx       # User management
│       ├── Products.jsx    # Product management
│       ├── Reviews.jsx     # Review management
│       ├── Analytics.jsx   # Analytics & reports
│       └── Settings.jsx    # System settings
├── firebase.js         # Firebase configuration
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Customization

- **Colors**: Update `tailwind.config.js` to customize the color scheme
- **Logo**: Replace the Shield icon in components with your own logo
- **Branding**: Update the "FolioXe" text throughout the application

## 🔒 Security

- Only users with `role: "admin"` can access the dashboard
- All routes are protected with authentication
- Firebase security rules should be configured to restrict admin access

## 📱 Usage

### Login
1. Navigate to the admin dashboard
2. Enter your admin email and password
3. The system will verify your admin role

### Navigation
- Use the sidebar to navigate between different sections
- The header shows your user info and theme toggle
- Mobile-friendly with collapsible sidebar

### Quick Actions
- Overview: View statistics and recent activity
- Users: Manage user accounts and roles
- Products: Approve/reject submitted products
- Reviews: Moderate user reviews
- Analytics: View detailed reports
- Settings: Configure system options

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

1. **Vercel**: Connect your GitHub repository and deploy automatically
2. **Netlify**: Drag and drop the `dist` folder
3. **Firebase Hosting**: Use Firebase CLI to deploy
4. **Any static hosting**: Upload the `dist` folder to your hosting provider

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Failed**: Ensure your user has `role: "admin"` in Firebase
2. **Firebase Connection**: Verify your Firebase configuration is correct
3. **Build Errors**: Check that all dependencies are installed

### Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Ensure admin role is set correctly
4. Check network connectivity

## 📄 License

This project is part of the FolioXe ecosystem and follows the same licensing terms.

---

**Note**: This admin dashboard is designed to work with your existing FolioXe Firebase project. Make sure to use the same Firebase configuration as your main application. 