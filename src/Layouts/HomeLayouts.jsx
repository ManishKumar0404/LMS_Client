import { FiMenu } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";
import Footer from "../Components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Slices/AuthSlice";
import { useState } from "react";

const HomeLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  const role = useSelector((state) => state?.auth?.role);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    const res = await dispatch(logout());
    if (res?.payload?.success) {
      navigate("/");
      closeDrawer();
    }
  };

  return (
    <div className="min-h-[90vh]">
      {!isOpen && (
        <div className="absolute z-50 left-0 w-fit">
          <button onClick={toggleDrawer} className="cursor-pointer relative">
            <FiMenu size={32} className="text-white m-4 hover:text-gray-300 transition" />
          </button>
        </div>
      )}

      <div
        className={`fixed top-0 left-0 w-60 sm:w-80 h-full bg-gray-900 text-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button onClick={toggleDrawer} className="absolute right-4 top-4 hover:text-red-500 transition">
          <AiFillCloseCircle size={28} />
        </button>
        <ul className="menu p-6 relative pb-24 flex flex-col justify-between h-full">
          <div>
            <li className="hover:bg-gray-800 rounded-md p-2 transition">
              <Link to={"/"} onClick={closeDrawer}>Home</Link>
            </li>
            {isLoggedIn && role === "ADMIN" && (
              <>
                <li className="hover:bg-gray-800 rounded-md p-2 transition">
                  <Link to={"/admin/dashboard"} onClick={closeDrawer}>Admin Dashboard</Link>
                </li>
                <li className="hover:bg-gray-800 rounded-md p-2 transition">
                  <Link to={"/course/create"} onClick={closeDrawer}>Create new course</Link>
                </li>
              </>
            )}

            <li className="hover:bg-gray-800 rounded-md p-2 transition">
              <Link to={"/courses"} onClick={closeDrawer}>All Courses</Link>
            </li>
            <li className="hover:bg-gray-800 rounded-md p-2 transition">
              <Link to={"/contact"} onClick={closeDrawer}>Contact Us</Link>
            </li>
            <li className="hover:bg-gray-800 rounded-md p-2 transition">
              <Link to={"/about"} onClick={closeDrawer}>About Us</Link>
            </li>
          </div>

          {!isLoggedIn ? (
            <li className="w-full px-4 mb-4">
              <div className="flex gap-3">
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 w-full text-center rounded-md hover:bg-blue-700 transition" onClick={closeDrawer}>
                  Login
                </Link>
                <Link to="/signup" className="bg-green-600 text-white px-4 py-2 w-full text-center rounded-md hover:bg-green-700 transition" onClick={closeDrawer}>
                  Signup
                </Link>
              </div>
            </li>
          ) : (
            <li className="w-full px-4 mb-4">
              <div className="flex gap-3">
                <Link to="/user/profile" className="bg-purple-600 text-white px-4 py-2 w-full text-center rounded-md hover:bg-purple-700 transition" onClick={closeDrawer}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 w-full rounded-md hover:bg-red-700 transition">
                  Logout
                </button>
              </div>
            </li>
          )}
        </ul>
      </div>

      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;
