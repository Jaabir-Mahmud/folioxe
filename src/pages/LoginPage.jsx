// folioxe/src/pages/LoginPage.jsx
// Your previously provided code for LoginPage.jsx is already up-to-date
// with the redirection logic and "Forgot Password?" link.
// For completeness, I'll include it here as you requested "full updated code".
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const GoogleIcon = () => ( <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <path d="M22.56,12.25C22.56,11.47 22.49,10.72 22.36,10H12V14.26H17.95C17.67,15.63 16.91,16.81 15.79,17.6L15.78,17.62L19.13,20.25L19.19,20.23C21.22,18.41 22.56,15.59 22.56,12.25Z" fill="#4285F4"/> <path d="M12,23C14.97,23 17.46,22.03 19.19,20.23L15.79,17.6C14.79,18.31 13.54,18.75 12,18.75C9.12,18.75 6.67,16.89 5.78,14.38L5.72,14.38L2.22,16.92L2.29,17C3.99,20.44 7.74,23 12,23Z" fill="#34A853"/> <path d="M5.78,14.38C5.57,13.74 5.46,13.07 5.46,12.38C5.46,11.68 5.57,11.02 5.78,10.38L5.78,10.37L2.29,7.75L2.22,7.82C1.53,9.18 1,10.73 1,12.38C1,14.02 1.53,15.57 2.22,16.92L5.78,14.38Z" fill="#FBBC05"/> <path d="M12,5.25C13.74,5.25 15.13,5.86 16.21,6.88L19.25,3.84C17.46,2.14 14.97,1 12,1C7.74,1 3.99,3.56 2.29,7L5.78,10.38C6.67,7.86 9.12,5.25 12,5.25Z" fill="#EA4335"/> </svg> );
const EyeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> </svg> );
const EyeSlashIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"> <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.575M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /> <path strokeLinecap="round" strokeLinejoin="round" d="M21 21 3 3" /> </svg> );

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false); // Changed from formLoading for consistency
  const [showResendVerification, setShowResendVerification] = useState(false);
  
  const { login, loginWithGoogle, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";


  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    setInfo('');
    setShowResendVerification(false);
    if (!email || !password) { setError('Please enter both email and password.'); return; }
    setLoading(true);
    try {
      await login(email, password); 
      navigate(from, { replace: true }); 
    } catch (authError) {
      console.error('Firebase Login Error in Page:', authError.code, authError.message);
      setError(authError.message || 'Failed to log in.');
      if (authError.code === 'auth/email-not-verified') { setShowResendVerification(true); }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(''); setInfo(''); setShowResendVerification(false); setLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true }); 
    } catch (authError) {
      console.error('Firebase Google Login Error in Page:', authError.message);
      setError(authError.message || 'Failed to log in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError(''); setInfo(''); setLoading(true);
    try {
      const result = await resendVerificationEmail();
      setInfo(result.message || "Verification email resent. Please check your inbox.");
      setShowResendVerification(false); 
    } catch (resendError) {
      setError(resendError.message || "Failed to resend verification email.");
    } finally {
      setLoading(false);
    }
  };

  // Your existing JSX for LoginPage, which is quite complete...
  // For brevity, I'll just indicate the return. Ensure your JSX structure from before is maintained.
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-start min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-8 md:p-10">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8"> Log In to FolioXe </h1>
          {error && ( <div className="mb-4 p-3 bg-red-100 dark:bg-red-700 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded-md text-sm"> {error} </div> )}
          {info && ( <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-700 border border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-100 rounded-md text-sm"> {info} </div> )}
          <form onSubmit={handleEmailLogin}>
            <div className="mb-6"> <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label> <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors" placeholder="you@example.com" required disabled={loading} /> </div>
            <div className="mb-6"> <div className="flex justify-between items-baseline"> <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label> <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</Link> </div> <div className="relative"> <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white transition-colors" placeholder="••••••••" required disabled={loading} /> <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" aria-label={showPassword ? "Hide password" : "Show password"}> {showPassword ? <EyeSlashIcon /> : <EyeIcon />} </button> </div> </div>
            {showResendVerification && ( <div className="mb-4 text-center"> <button type="button" onClick={handleResendVerification} className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-70" disabled={loading} > {loading ? 'Sending...' : 'Resend verification email'} </button> </div> )}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-70" disabled={loading}> {loading ? 'Logging In...' : 'Log In'} </button>
          </form>
          <div className="my-6 flex items-center"> <hr className="flex-grow border-gray-300 dark:border-gray-600" /> <span className="mx-4 text-xs text-gray-500 dark:text-gray-400">OR</span> <hr className="flex-grow border-gray-300 dark:border-gray-600" /> </div>
          <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-70" disabled={loading}> <GoogleIcon /> Log In with Google </button>
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400"> Don't have an account?{' '} <Link to="/signup" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">Sign Up</Link> </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;