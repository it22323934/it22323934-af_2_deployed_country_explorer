import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Button, Modal, TextInput, Spinner } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineExclamationCircle,
  HiOutlineCamera,
  HiMail,
  HiUser,
  HiLockClosed,
  HiPhone,
  HiIdentification,
} from "react-icons/hi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutSuccess,
} from "../../redux/user/userSlice";
import { ToastContainer, toast } from "react-toastify";
import {
  uploadProfileImage,
  updateUserProfile,
  deleteUserAccount,
  signOutUser,
} from "../../service/authService";

export default function DashProfile() {
  const { currentUser, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/sign-in");
    }
  }, [currentUser, navigate]);

  // Improve the handleEventChange function for better error handling
  const handleEventChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.split("/")[0] !== "image") {
        setImageUploadError("File must be an image");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setImageUploadError("File size must be less than 2MB");
        return;
      }

      setImageUploadError(null);
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // Update the uploadImage function in DashProfile.jsx
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageUploadError(null);

    try {
      // Pass a callback function to handle progress updates
      const downloadURL = await uploadProfileImage(imageFile, (progress) => {
        // Update progress state with each callback
        setImageUploadProgress(progress);
      });

      // Once completed (promise resolved), update the state with the URL
      setImageFileUrl(downloadURL);
      setFormData({ ...formData, profilePicture: downloadURL });
      setImageFileUploading(false);
      setImageUploadProgress(null);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setImageUploadError(
        "Could not upload image (File must be less than 2MB)"
      );
      setImageUploadProgress(null);
      setImageFile(null);
      setImageFileUrl(null);
      setImageFileUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      toast.error("No changes to be made");
      return;
    }

    if (imageFileUploading) {
      toast.error("Please wait for image to upload before submitting");
      return;
    }

    try {
      dispatch(updateStart());
      const data = await updateUserProfile(currentUser._id, formData);
      dispatch(updateSuccess(data));
      toast.success("Profile updated successfully");
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);

    try {
      dispatch(deleteUserStart());
      await deleteUserAccount(currentUser._id);
      dispatch(deleteUserSuccess());
      toast.success("Account deleted successfully");
      navigate("/");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      toast.error(error.message);
    }
  };

  const handleSignout = async () => {
    try {
      await signOutUser();
      dispatch(signOutSuccess());
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <ToastContainer position="top-center" />
      <h1 className="my-7 text-center font-bold text-3xl dark:text-white">
        Profile
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleEventChange}
            ref={filePickerRef}
            hidden
          />

          {/* Profile Image with improved loading state */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="relative w-32 h-32 cursor-pointer shadow-md overflow-hidden rounded-full group"
              onClick={() =>
                !imageFileUploading && filePickerRef.current.click()
              }
            >
              {imageUploadProgress !== null && (
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress}%`}
                  strokeWidth={5}
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 10,
                    },
                    path: {
                      stroke: `rgba(62, 152, 199, ${
                        imageUploadProgress / 100
                      })`,
                    },
                    text: {
                      fill: "#ffffff",
                      fontSize: "24px",
                      fontWeight: "bold",
                      filter: "drop-shadow(0px 0px 2px rgba(0,0,0,0.7))",
                    },
                  }}
                />
              )}
              <img
                src={
                  imageFileUrl ||
                  currentUser.profilePicture ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="user"
                className={`rounded-full w-full h-full object-cover border-4 border-gray-200 dark:border-gray-700 
        ${imageUploadProgress !== null ? "opacity-60" : ""}`}
              />
              <div
                className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center 
      ${
        imageFileUploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      } transition-all duration-300`}
              >
                {!imageFileUploading && (
                  <HiOutlineCamera className="text-white text-3xl" />
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {imageFileUploading
                ? "Uploading..."
                : "Click to change profile picture"}
            </p>
          </div>

          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}

          {/* Form Fields */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Username
            </label>
            <TextInput
              type="text"
              id="username"
              icon={HiUser}
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <TextInput
              type="email"
              id="email"
              icon={HiMail}
              defaultValue={currentUser.email}
              onChange={handleChange}
              disabled
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <TextInput
              type="password"
              id="password"
              icon={HiLockClosed}
              placeholder="Leave blank to keep current password"
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Phone Number
            </label>
            <TextInput
              type="tel"
              id="phone"
              icon={HiPhone}
              placeholder="+1 123 456 7890"
              defaultValue={currentUser.phone || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="nic"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              NIC Number
            </label>
            <TextInput
              type="text"
              id="nic"
              icon={HiIdentification}
              placeholder="123456789V"
              defaultValue={currentUser.nic || ""}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            outline
            disabled={loading || imageFileUploading}
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="ml-2">Updating...</span>
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>

        {/* Account Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-4 flex justify-between text-sm">
          <Button color="failure" outline onClick={() => setShowModal(true)}>
            Delete Account
          </Button>

          <Button color="light" onClick={handleSignout}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-red-500 dark:text-red-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-700 dark:text-gray-300 font-medium">
              Are you sure you want to delete your account?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              This action cannot be undone. All your data will be permanently
              removed.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={handleDeleteUser}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, delete my account"}
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
