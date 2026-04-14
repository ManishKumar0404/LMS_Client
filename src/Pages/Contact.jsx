import React, { useState } from 'react'
import HomeLayout from '../Layouts/HomeLayouts'
import { toast } from 'react-hot-toast'
import axiosInstance from "../Helper/axiosinstance.js";


const  Contact = () => {
  

  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    message: "",
  });

  // function to handle the input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInput({ ...userInput, [name]: value });
  };



  const handleFormSubmit = async (event) => {
    event.preventDefault();
 

    if (!userInput.email || !userInput.name || !userInput.message) {
      toast.error("All fields are mandatory");
      return;
    }

       if (!userInput.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
          toast.error("Invalid email ID");
          return;
        }

        try {
            const res = await axiosInstance.post("/contact", userInput);

            if (res.data.success) {
              toast.success("Form submitted successfully");
              setUserInput({
                name: "",
                email: "",
                message: "",
              });
            }
        }
  
  catch (error) {
    console.error("Contact form error:", error);
    toast.error(error.response?.data?.message || "Failed to submit form");
  }

}
  return (
    <HomeLayout>
      <div className='flex items-center justify-center h-[100vh]'>
        <form 
        noValidate 
        onSubmit={handleFormSubmit} 
        className='flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_aqua]'>
          <h1 className='text-center text-2xl font-bold'>Contact Form</h1>

          <div className='flex flex-col w-full gap-1'>
            <label htmlFor="name" className='text-xl font-semibold'>Name</label>
            <input
              type="text"
              required
              name='name'
              id='name'
              placeholder='Enter your name..'
              className='bg-transparent px-2 py-1 border rounded-sm'
              onChange={handleInputChange}
              value={userInput.name}
            />
          </div>
          <div className='flex flex-col w-full gap-1'>
            <label htmlFor="email" className='text-xl font-semibold'>Email</label>
            <input
              type="email"
              required
              name='email'
              id='email'
              placeholder='Enter your email..'
              className='bg-transparent px-2 py-1 border rounded-sm'
              onChange={handleInputChange}
              value={userInput.email}
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label className="text-xl font-semibold" htmlFor="message">
              Message
            </label>
            <textarea
              className="bg-transparent border px-2 py-1 rounded-sm resize-none h-40"
              name="message"
              id="message"
              placeholder="Enter your message"
              value={userInput.message}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <button type="submit" 
          className='mt-1 bg-yellow-600 hover:bg-yellow-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer'>
            Submit
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Contact;
