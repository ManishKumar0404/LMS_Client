import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; 
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import HomeLayout from "../../Layouts/HomeLayouts";
import { getUserData, updateProfile } from "../../Redux/Slices/AuthSlice";
import { AiOutlineArrowLeft } from "react-icons/ai";

function EditProfile() {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const userData = useSelector((state) => state?.auth?.data);

   const [isLoading, setIsLoading] = useState(false);
   const [data, setData] = useState({
      previewImage: "",
      fullName: "",
      avatar: undefined,
      userId: "",
   });

   // Sync userData to local state when component mounts
   useEffect(() => {
      if (userData) {
         setData({
            previewImage: "",
            fullName: userData?.fullName || "",
            avatar: undefined,
            userId: userData?._id,
         });
      }
   }, [userData]);

   function handleImageUpload(e) {
      e.preventDefault();
      if (!e.target.files.length) return;

      const uploadedImage = e.target.files[0];

      if (!uploadedImage.type.startsWith("image/")) {
         toast.error("Please upload a valid image file.");
         return;
      }

      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);

      fileReader.onload = function () {
         setData((prevData) => ({
            ...prevData,
            previewImage: fileReader.result,
            avatar: uploadedImage,
         }));
      };

      fileReader.onerror = function (error) {
         console.error("File reading error:", error);
         toast.error("Error reading image file.");
      };
   }

   function handleInputChange(e) {
      const { name, value } = e.target;
      setData((prevData) => ({
         ...prevData,
         [name]: value,
      }));
   }

   async function onFormSubmit(e) {
      e.preventDefault();
      setIsLoading(true);

      try {
         if (!data.fullName || !data.avatar) {
            toast.error("All fields are mandatory");
            setIsLoading(false);
            return;
         }

         if (data.fullName.length < 5) {
            toast.error("Name cannot be less than 5 characters");
            setIsLoading(false);
            return;
         }

         const formData = new FormData();
         formData.append("fullName", data.fullName);
         formData.append("avatar", data.avatar);

         const response = await dispatch(updateProfile([data.userId, formData])).unwrap();

         if (response?.success) {
            await dispatch(getUserData());
            toast.success("Profile updated successfully");
            navigate("/user/profile");
         } else {
            throw new Error(response?.message || "Failed to update profile");
         }
      } catch (error) {
         console.error("Profile update error:", error);
         toast.error(error.message || "An error occurred");
      } finally {
         setIsLoading(false);
      }
   }

   return (
      <HomeLayout>
         <div className="flex items-center justify-center h-[100vh]">
            <form
               onSubmit={onFormSubmit}
               className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-96 min-h-[26rem] shadow-[0_0_10px_aqua]"
            >
               <h1 className="text-center text-2xl font-semibold">Edit Profile</h1>

               {/* Image Upload Section */}
               <label htmlFor="image_uploads" className="cursor-pointer">
                  {data.previewImage ? (
                     <img
                        className="w-40 h-40 rounded-full m-auto border"
                        src={data.previewImage}
                        alt="Preview"
                     />
                  ) : (
                     <div className="w-40 h-40 rounded-full m-auto border flex items-center justify-center">
                        <span className="text-lg">Choose Image</span>
                     </div>
                  )}
               </label>
               <input
                  type="file"
                  id="image_uploads"
                  name="image_uploads"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
               />

               {/* Name Input Field */}
               <div className="flex flex-col gap-1">
                  <label htmlFor="fullName" className="text-lg font-semibold">
                     Full Name
                  </label>
                  <input
                     required
                     type="text"
                     name="fullName"
                     id="fullName"
                     placeholder="Enter your name"
                     className="bg-transparent px-2 py-1 border rounded"
                     value={data.fullName}
                     onChange={handleInputChange}
                     minLength="5"
                  />
               </div>

               {/* Submit Button */}
               <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 rounded-sm font-semibold text-lg cursor-pointer
                     ${isLoading ? "bg-yellow-400" : "bg-yellow-600 hover:bg-yellow-500"}
                     transition-all ease-in-out duration-300`}
               >
                  {isLoading ? "Updating..." : "Update Profile"}
               </button>

               {/* Go Back Link */}
               <Link to="/user/profile">
                  <p className="link text-accent cursor-pointer flex items-center justify-center w-full">
                     <AiOutlineArrowLeft /> Go back to profile
                  </p>
               </Link>
            </form>
         </div>
      </HomeLayout>
   );
}

export default EditProfile;
