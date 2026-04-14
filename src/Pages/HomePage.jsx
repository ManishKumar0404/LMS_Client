import React from 'react';
import HomeLayouts from '../Layouts/HomeLayouts';
import { Link } from 'react-router-dom';
import HomePageImage from "../assets/Images/homePageMainImage.png";

function HomePage() {
  return (
    <HomeLayouts>
      <div className='pt-10 text-white flex flex-col lg:flex-row items-center justify-center gap-10 mx-4 lg:mx-16 min-h-[90vh]'>
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className='text-3xl sm:text-5xl font-semibold'>
            Find out the best
            <span className='text-yellow-500 font-bold'> Online Courses</span>
          </h1>
          <p className='text-lg sm:text-xl text-gray-200'>
            We have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center lg:justify-start">
            <Link to="/courses">
              <button className='bg-yellow-500 px-6 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all'>
                Explore Courses
              </button>
            </Link>

            <Link to="/contact">
              <button className='border border-yellow-500 px-6 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-yellow-600 transition-all'>
                Contact Us
              </button>
            </Link>
          </div>
        </div>

        <div className='w-full lg:w-1/2 flex items-center justify-center'>
          <img src={HomePageImage} alt="homepage" className='max-w-full h-auto' />
        </div>
      </div>
    </HomeLayouts>
  );
}

export default HomePage;