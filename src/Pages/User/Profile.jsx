import { useDispatch, useSelector } from 'react-redux';
import HomeLayout from '../../Layouts/HomeLayouts';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axiosInstance from '../../Helper/axiosinstance';
import { getUserData } from '../../Redux/Slices/AuthSlice';
import toast from 'react-hot-toast';
import { cancelCourseBundle } from '../../Redux/Slices/RazorpaySlice';

const DEFAULT_AVATAR = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIgZmlsbD0iIzU1NSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjQiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSI4MCIgcj0iMzAiIGZpbGw9IiNmZmYiLz4KICA8cGF0aCBkPSJNNTAgMTgwYzAtMjcuNiAyMi40LTUwIDUwLTUwaDUwYzI3LjYgMCA1MCAyMi40IDUwIDUwIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==`;

const Profile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userData = useSelector((state) => state?.auth?.data);
    const [avatarError, setAvatarError] = useState(false);

    async function handleCancellation() {
        toast("Initiating cancellation...");
        
        try {
            const response = await dispatch(cancelCourseBundle());
            console.log("Cancellation response:", response);
            
            await dispatch(getUserData());  // Refresh user data after cancellation
            
            toast.success("Cancellation completed!");
            navigate("/");
        } catch (error) {
            toast.error("Cancellation failed!");
            console.error("Error in cancellation:", error);
        }
    }

    // Function to get valid avatar URL
    const getAvatarUrl = (avatar) => {
        if (!avatar) return DEFAULT_AVATAR;
        
        // If it's a Cloudinary URL
        if (avatar.includes('cloudinary.com')) {
            return avatar;
        }

         // If it's any other full URL
         if (avatar.startsWith('http') || avatar.startsWith('https')) {
            return avatar;
        }

        // If it's a data URL
        if (avatar.startsWith('data:')) {
            return avatar;
        }

        // If it's a file path, use the baseURL from axiosInstance
        try {
            const fileName = avatar.split('\\').pop().split('/').pop();
            return `${axiosInstance.defaults.baseURL}/uploads/${fileName}`;
        } catch (error) {
            console.error('Error processing avatar path:', error);
            return DEFAULT_AVATAR;
        }
    };

    // Get avatar URL with fallback
    const avatarUrl = avatarError ? DEFAULT_AVATAR : getAvatarUrl(userData?.avatar);

    // Debug logs
    console.log("Current user data:", userData);
    console.log("Avatar URL being used:", avatarUrl);

    const handleImageError = (e) => {
        console.log("Image load error for:", e.target.src);
        setAvatarError(true);
        e.target.src = DEFAULT_AVATAR;
    };

    if (!userData) {
        return (
            <HomeLayout>
                <div className="min-h-[90vh] flex items-center justify-center">
                    <p className="text-white">Loading profile...</p>
                </div>
            </HomeLayout>
        );
    }

    return (
        <HomeLayout>
            <div className='min-h-[90vh] flex items-center justify-center'>
                <div className='my-10 flex flex-col gap-4 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_aqua]'>
                    <div className="relative w-40 h-40 mx-auto">
                        <img
                            className="w-full h-full rounded-full border border-white object-cover"
                            src={avatarUrl}
                            alt={`${userData?.fullName || 'User'}'s profile`}
                            onError={handleImageError}
                        />
                    </div>

                    <h3 className='text-xl font-semibold text-center capitalize'>
                        {userData?.fullName || 'Anonymous User'}
                    </h3>

                   
                    <div className="grid grid-cols-2 gap-2">
                        <p className="font-semibold">Email:</p>
                        <p>{userData?.email || "N/A"}</p>
                        <p className="font-semibold">Role:</p>
                        <p className="capitalize">{userData?.role || "User"}</p>
                        <p className="font-semibold">Subscription:</p>
                        <p>{userData?.subscription?.status === 'active' ? (
                            <span className="text-green-500">Active</span>
                        ) : (
                            <span className="text-yellow-500">Inactive</span>
                        )}</p>
                    </div>

                    <div className='flex items-center justify-between gap-2'>
                        <Link 
                            to="/user/change-password" 
                            className="w-full bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 rounded py-2 font-semibold text-center">
                            Change Password
                        </Link>

                        <Link 
                            to="/user/editprofile"
                            className='w-1/2 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer text-center'
                        >
                            Edit profile
                        </Link>
                    </div>

                    {userData?.subscription?.status === 'active' && (
                       <button 
                       className='w-full bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-sm font-semibold py-2 cursor-pointer text-center'
                       onClick={handleCancellation} // ✅ Call the function properly
                   >
                       Cancel Subscription
                   </button>
                    )}
                </div>
            </div>
        </HomeLayout>
    );
}

export default Profile;