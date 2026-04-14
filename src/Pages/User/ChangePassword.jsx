import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import HomeLayout from "../../Layouts/HomeLayouts";
import { changePassword } from "../../Redux/Slices/AuthSlice";
import { AiOutlineArrowLeft, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  function handleUserInput(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!data.oldPassword || !data.newPassword) {
      toast.error("All fields are required");
      return;
    }

    if (data.oldPassword === data.newPassword) {
      toast.error("New password cannot be same as old password");
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/;
    if (!passwordRegex.test(data.newPassword)) {
      toast.error("Password must be 8 characters long with at least one uppercase, lowercase, number and special character");
      return;
    }

    try {
      const response = await dispatch(changePassword(data)).unwrap();
      if (response?.success) {
        navigate("/user/profile");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to change password");
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-[100vh] flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-6 rounded-lg p-8 text-white text-white w-96 shadow-[0_0_10px_aqua]"
        >
          <h2 className="text-2xl font-bold text-center">Change Password</h2>

          <div className="flex flex-col gap-1">
            <label htmlFor="oldPassword" className="font-medium">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                id="oldPassword"
                name="oldPassword"
                placeholder="Enter current password"
                value={data.oldPassword}
                onChange={handleUserInput}
                className="w-full bg-transparent px-4 py-2 rounded border"
              />
              <button 
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="newPassword" className="font-medium">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                value={data.newPassword}
                onChange={handleUserInput}
                className="w-full bg-transparent px-4 py-2 rounded border"
              />
              <button 
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 transition-all ease-in-out duration-300 py-2 rounded font-semibold text-lg"
          >
            Change Password
          </button>

          <Link
            to="/user/profile"
            className="link text-accent flex items-center gap-2"
          >
            <AiOutlineArrowLeft /> Back to Profile
          </Link>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ChangePassword;
