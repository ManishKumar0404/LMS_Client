import React, { useState } from 'react'
import HomeLayout from '../Layouts/HomeLayouts'
import { BsPersonCircle } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-hot-toast'
import { createAccount } from '../Redux/Slices/AuthSlice'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

function Signup() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const [signupData, setSignData] = useState({
    fullName: "",
    email: "",
    password: "",
    avatar: ""
  });

  function handleUserInput(e) {
    const { name, value } = e.target;
    setSignData({
      ...signupData,
      [name]: value
    })
  }

  function getImage(e) {
    e.preventDefault(); // ✅ Fix missing `e` parameter

    const uploadedImage = e.target.files[0];

    if (uploadedImage) {
        console.log("Selected file:", uploadedImage); // ✅ Debugging

        setSignData(prevData => ({
            ...prevData,
            avatar: uploadedImage // ✅ Store file correctly
        }));

        const fileReader = new FileReader();
        fileReader.readAsDataURL(uploadedImage);
        fileReader.onload = function () {
            setPreviewImage(fileReader.result); // ✅ Set preview image correctly
        };
    } else {
        console.error("No file selected");
    }
}


  async function createNewAccount(event) {
    event.preventDefault();
  
    if (!signupData.email || !signupData.password || !signupData.fullName || !signupData.avatar) {
      toast.error("Please fill all the details");
      return;
    }
  
    if (signupData.fullName.length < 5) {
      toast.error("Name should be at least 5 characters long");
      return;
    }
  
    if (!signupData.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      toast.error("Invalid email ID");
      return;
    }
  
    if (!signupData.password.match(/^(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/)) {
      toast.error("Password should be 6-16 characters long with at least a number and special character.");
      return;
    }
  
    const formData = new FormData();
    formData.append("fullName", signupData.fullName);
    formData.append("email", signupData.email);
    formData.append("password", signupData.password);
    formData.append("avatar", signupData.avatar); // ✅ Make sure the file is appended correctly
  
     // ✅ Debugging: Check if FormData contains the correct file
     for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);  // Should log: "avatar" File {name: "image.jpg", type: "image/jpeg", size: ...}
  }

  const response = await dispatch(createAccount(formData));
  if (response?.payload?.success) {
      navigate("/");
  }

  setSignData({
      fullName: "",
      email: "",
      password: "",
      avatar: ""
  });
  setPreviewImage("");
  }
  

  return (
    <HomeLayout>
      <div className='flex items-center justify-center h-[100vh] '>
        <form noValidate onSubmit={createNewAccount} className='flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px]'>
          <h1 className='text-center text-2xl font-bold'>
            Registration page
          </h1>

          <label htmlFor="avatar" className='cursor-pointer'>
            {previewImage ? (
              <img className='w-24 h-24 rounded-full m-auto' src={previewImage} />
            ) : (
              <BsPersonCircle className='w-24 h-24 rounded-full m-auto' />
            )}
          </label>
          <input
          onChange={getImage}
            className='hidden'
            type='file'
            name='avatar'
            id='avatar'
            // accept='.jpg, .jpeg, .png, .svg'
          />

          <div className='flex flex-col gap-1'>
            <label htmlFor="fullName" className='font-semibold'>Name</label>
            <input
              type="text"
              required
              name='fullName'
              id='fullName'
              placeholder='Enter your Name..'
              className='bg-transparent px-2 py-1 border rounded-sm'
              onChange={handleUserInput}
              value={signupData.fullName}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor="email" className='font-semibold'>Email</label>
            <input
              type="email"
              required
              name='email'
              id='email'
              placeholder='Enter your email..'
              className='bg-transparent px-2 py-1 border rounded-sm'
              onChange={handleUserInput}
              value={signupData.email}
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor="password" className='font-semibold'>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                name='password'
                id='password'
                placeholder='Enter your password..'
                className='w-full bg-transparent px-2 py-1 border rounded-sm'
                onChange={handleUserInput}
                value={signupData.password}
              />
              <button 
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className='mt-1 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg'>
            Create account
          </button>
          <p className='text-center'>
            Already have an account ? <Link to="/login" className="link text-accent cursor-pointer">Login</Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  )
}

export default Signup
