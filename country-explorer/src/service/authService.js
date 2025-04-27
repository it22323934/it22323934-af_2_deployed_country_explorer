import { app } from "../../firebase";
import { 
  getAuth, 
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Initialize Firebase auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

/**
 * User registration with email and password
 */
export const registerUser = async (username, email, password) => {
  const response = await fetch("api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }
  return data;
};

/**
 * User login with email and password
 */
export const loginUser = async (email, password) => {
  const response = await fetch("api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  return data;
};

/**
 * Google OAuth sign in
 */
export const googleLogin = async () => {
  try {
    const resultFromGoogle = await signInWithPopup(auth, provider);
    
    const response = await fetch("api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: resultFromGoogle.user.displayName,
        email: resultFromGoogle.user.email,
        googlePhotoURL: resultFromGoogle.user.photoURL,
      }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Google authentication failed");
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "Google authentication failed");
  }
};

/**
 * Sign out user
 */
export const signOutUser = async () => {
  const response = await fetch("/api/user/signout", {
    method: "POST",
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Sign out failed");
  }
  return data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, userData) => {
  const response = await fetch(`/api/user/update/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Profile update failed");
  }
  return data;
};

/**
 * Delete user account
 */
export const deleteUserAccount = async (userId) => {
  const response = await fetch(`/api/user/delete/${userId}`, {
    method: "DELETE",
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Account deletion failed");
  }
  return data;
};

/**
 * Upload profile image to Firebase Storage
 * @param {File} imageFile - The image file to upload
 * @param {Function} progressCallback - Callback function to handle progress updates
 * @returns {Promise<string>} - Promise resolving to the download URL
 */
export const uploadProfileImage = async (imageFile, progressCallback) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate progress percentage
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        
        // Call the progress callback instead of resolving
        if (progressCallback) {
          progressCallback(progress);
        }
      },
      (error) => {
        // Handle errors
        reject(error);
      },
      async () => {
        // Handle successful uploads - this is where we resolve
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};