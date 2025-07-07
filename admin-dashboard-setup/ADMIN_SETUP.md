# FolioXe Admin Dashboard - Admin Account Setup

This guide will help you create admin accounts for the FolioXe admin dashboard.

## Method 1: Using the Web Interface (Recommended)

### Step 1: Access the Create Admin Page
1. Navigate to your admin dashboard
2. Go to `/create-admin` (e.g., `http://localhost:5176/create-admin`)
3. Or click the "Create one here" link on the login page

### Step 2: Fill Out the Form
- **First Name**: Enter the admin's first name
- **Last Name**: Enter the admin's last name
- **Email**: Enter a valid email address
- **Password**: Create a strong password (minimum 8 characters)
- **Confirm Password**: Re-enter the password
- **Admin Creation Code**: Enter `FOLIOXE_ADMIN_2024`

### Step 3: Create the Account
Click "Create Admin Account" and wait for the success message.

## Method 2: Using the Node.js Script

### Step 1: Install Dependencies
```bash
cd admin-dashboard-setup
npm install
```

### Step 2: Edit the Script
Open `create-admin.js` and modify these values:
```javascript
const ADMIN_EMAIL = 'admin@folioxe.com';        // Change to desired email
const ADMIN_PASSWORD = 'Admin123!@#';           // Change to desired password
const ADMIN_FIRST_NAME = 'Admin';               // Change to desired first name
const ADMIN_LAST_NAME = 'User';                 // Change to desired last name
```

### Step 3: Run the Script
```bash
node create-admin.js
```

The script will create the admin account and display the credentials.

## Method 3: Manual Firebase Console Setup

### Step 1: Create User in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`folioxe-admin`)
3. Go to Authentication > Users
4. Click "Add User"
5. Enter email and password

### Step 2: Create User Document in Firestore
1. Go to Firestore Database
2. Create a document in the `users` collection
3. Use the user's UID as the document ID
4. Add the following fields:
```json
{
  "email": "admin@folioxe.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin",
  "isAdmin": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "lastLogin": "2024-01-01T00:00:00.000Z",
  "status": "active"
}
```

## Security Considerations

### Admin Creation Code
The default admin creation code is `FOLIOXE_ADMIN_2024`. You should change this in the `CreateAdminPage.jsx` file:

```javascript
const ADMIN_CREATION_CODE = 'YOUR_SECURE_CODE_HERE';
```

### Password Requirements
- Minimum 8 characters
- Use a combination of uppercase, lowercase, numbers, and symbols
- Avoid common passwords

### Email Verification
Consider enabling email verification in Firebase Authentication settings.

## Login Credentials

After creating an admin account, you can log in with:
- **Email**: The email you used during account creation
- **Password**: The password you set

## Troubleshooting

### Common Issues

1. **"Access denied. Admin privileges required."**
   - Make sure the user document in Firestore has `role: "admin"`

2. **"User not found in database."**
   - The user exists in Firebase Auth but not in Firestore
   - Create the user document manually in Firestore

3. **"Invalid admin creation code"**
   - Check that you're using the correct code: `FOLIOXE_ADMIN_2024`
   - Or update the code in `CreateAdminPage.jsx`

4. **"Email already in use"**
   - The email is already registered
   - Use a different email or reset the password

### Firebase Configuration
Make sure your Firebase configuration in `src/firebase.js` matches your project settings.

## Multiple Admin Accounts

You can create multiple admin accounts using any of the methods above. Each admin will have full access to the dashboard.

## Password Reset

If an admin forgets their password:
1. Go to Firebase Console > Authentication > Users
2. Find the user and click "Reset password"
3. An email will be sent to reset the password

## Best Practices

1. **Use strong passwords** for all admin accounts
2. **Limit admin access** to trusted personnel only
3. **Regularly review** admin accounts and remove unused ones
4. **Enable 2FA** for additional security
5. **Monitor login activity** through Firebase Console
6. **Keep admin creation code secure** and change it regularly

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify Firebase configuration
3. Ensure all dependencies are installed
4. Check Firebase Console for authentication errors 