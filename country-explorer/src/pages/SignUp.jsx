import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { HiMail, HiLockClosed, HiUser } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { registerUser, googleLogin } from "../service/authService";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const { loading, error: errorMessage, currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Redirect if already logged in
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    
    // Check password strength when password field changes
    if (e.target.id === 'password') {
      const password = e.target.value.trim();
      if (password.length < 6) {
        setPasswordStrength("weak");
      } else if (password.length < 10) {
        setPasswordStrength("medium");
      } else {
        setPasswordStrength("strong");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill out all the fields");
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    try {
      dispatch(signInStart());
      await registerUser(formData.username, formData.email, formData.password);
      toast.success("Sign up successful! Please sign in.");
      navigate("/sign-in");
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message);
    }
  };
  
  const handleGoogleSignUp = async () => {
    try {
      dispatch(signInStart());
      const data = await googleLogin();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen mt-40">
      <ToastContainer position="top-center" />
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex-1">
          <div className="font-bold dark:text-white text-4xl flex flex-col">
            <div>
              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white">
                Country
              </span>
            </div>
            <div className="mt-1">Explorer</div>
          </div>
          <p className="text-sm mt-5 text-gray-500 dark:text-gray-300">
            Create an account to save your favorite countries and access personalized features.
            You can register with email or continue with Google.
          </p>
        </div>
        
        {/* Right */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Create Account</h2>
            
            {errorMessage && (
              <Alert color="failure" className="mb-4">
                {errorMessage}
              </Alert>
            )}
            
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label value="Username" className="mb-1" />
                <TextInput
                  type="text"
                  placeholder="johndoe"
                  id="username"
                  icon={HiUser}
                  value={formData.username || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label value="Email" className="mb-1" />
                <TextInput
                  type="email"
                  placeholder="name@company.com"
                  id="email"
                  icon={HiMail}
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label value="Password" className="mb-1" />
                <TextInput
                  type="password"
                  placeholder="••••••••"
                  id="password"
                  icon={HiLockClosed}
                  value={formData.password || ""}
                  onChange={handleChange}
                  required
                  helperText={
                    passwordStrength && (
                      <span className={`text-xs ${
                        passwordStrength === 'weak' ? 'text-red-500' : 
                        passwordStrength === 'medium' ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}>
                        Password strength: {passwordStrength}
                      </span>
                    )
                  }
                />
              </div>
              
              <Button
                gradientDuoTone="purpleToBlue"
                type="submit"
                disabled={loading}
                className="mt-2"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Creating account...</span>
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
              
              <div className="flex items-center my-2">
                <hr className="flex-1 border-gray-300 dark:border-gray-600" />
                <span className="px-3 text-gray-500 dark:text-gray-400 text-sm">OR</span>
                <hr className="flex-1 border-gray-300 dark:border-gray-600" />
              </div>
              
              <Button
                color="light"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="flex items-center justify-center"
              >
                <FcGoogle className="mr-2 h-5 w-5" />
                Continue with Google
              </Button>
            </form>
            
            <div className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/sign-in" className="text-blue-600 hover:underline dark:text-blue-400">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}