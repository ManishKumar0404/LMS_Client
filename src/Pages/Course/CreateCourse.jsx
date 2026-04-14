import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";
import HomeLayout from "../../Layouts/HomeLayouts";
import { AiOutlineArrowLeft } from "react-icons/ai";

function CreateCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [userInput, setUserInput] = useState({
    title: "",
    category: "",
    createdBy: "",
    description: "",
    thumbnail: null,
    previewImage: "",
  });

  // Debug log for file upload
  function handleImageUpload(e) {
    e.preventDefault();
    const uploadedImage = e.target.files[0];
    console.log("Uploaded Image:", uploadedImage);

    if (uploadedImage) {
      // Validate file type
      if (!uploadedImage.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.addEventListener("load", function () {
        console.log("Image loaded successfully");
        setUserInput((prev) => ({
          ...prev,
          previewImage: this.result,
          thumbnail: uploadedImage,
        }));
      });

      fileReader.addEventListener("error", function () {
        console.error("FileReader error:", this.error);
        toast.error("Error reading image file");
      });
    }
  }

  function handleUserInput(e) {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function onFormSubmit(e) {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = ['title', 'description', 'category', 'thumbnail', 'createdBy'];
    const missingFields = requiredFields.filter(field => !userInput[field]);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setIsLoading(true);

      // Debug log for form submission
      console.log("Submitting course data:", userInput);

      // Ensure the thumbnail file is correctly appended
      const formData = new FormData();
      formData.append("title", userInput.title);
      formData.append("description", userInput.description);
      formData.append("category", userInput.category);
      formData.append("createdBy", userInput.createdBy);
      formData.append("thumbnail", userInput.thumbnail);

      const response = await dispatch(createNewCourse(formData));
      console.log("Course creation response:", response);

      if (response?.payload?.success) {
        toast.success("Course created successfully!");
        setUserInput({
          title: "",
          category: "",
          createdBy: "",
          description: "",
          thumbnail: null,
          previewImage: "",
        });
        navigate("/courses");
      } else {
        toast.error(response?.payload?.message || "Failed to create course");
      }
    } catch (error) {
      console.error("Course creation error:", error);
      toast.error("Error creating course");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-[700px] my-10 shadow-[0_0_10px_aqua] relative"
        >
          <Link to="/courses" className="absolute top-8 left-8 text-2xl text-accent cursor-pointer">
            <AiOutlineArrowLeft />
          </Link>

          <h1 className="text-center text-2xl-pink font-bold">Create New Course</h1>

          <main className="grid grid-cols-2 gap-x-10">
            <div className="gap-y-6">
              <div>
                <label htmlFor="image_uploads" className="cursor-pointer ">
                  {userInput.previewImage ? (
                    <img className="w-full h-44 m-auto border" src={userInput.previewImage} alt="" />
                  ) : (
                    <div className="w-full h-44 m-auto flex items-center justify-center border shadow-[0_0_10px_aqua]">
                      <h1 className="font-bold text-lg">Upload your course thumbnail</h1>
                    </div>
                  )}
                </label>
                <input className="hidden" type="file" id="image_uploads" name="image_uploads" onChange={handleImageUpload} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold" htmlFor="title">
                  Course title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Enter course title"
                  className="bg-transparent px-2 py-1 border shadow-[0_0_10px_aqua]"
                  value={userInput.title}
                  onChange={handleUserInput} // **FIXED**
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold shadow-[0_0_10px_orange]" htmlFor="createdBy">
                  Course Instructor
                </label>
                <input
                  required
                  type="text"
                  name="createdBy"
                  id="createdBy"
                  placeholder="Enter course instructor"
                  className="bg-transparent px-2 py-1 border"
                  value={userInput.createdBy}
                  onChange={handleUserInput} // **FIXED**
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold shadow-[0_0_10px_orange]" htmlFor="category">
                  Course category
                </label>
                <input
                  required
                  type="text"
                  name="category"
                  id="category"
                  placeholder="Enter course category"
                  className="bg-transparent px-2 py-1 border shadow-[0_0_10px_aqua]"
                  value={userInput.category}
                  onChange={handleUserInput} // **FIXED**
                />
              </div>

              <div className="flex flex-col gap-1 ">
                <label className="text-lg font-semibold shadow-[0_0_10px_orange]" htmlFor="description">
                  Course description
                </label>
                <textarea
                  required
                  name="description"
                  id="description"
                  placeholder="Enter course description"
                  className="bg-transparent px-2 py-1 h-24 overflow-y-scroll resize-none border shadow-[0_0_10px_aqua]"
                  value={userInput.description}
                  onChange={handleUserInput} // **FIXED**
                />
              </div>
            </div>
          </main>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-sm font-semibold text-lg cursor-pointer shadow-[0_0_10px_aqua]
              ${isLoading ? 'bg-yellow-400' : 'bg-yellow-600 hover:bg-yellow-500'} 
              transition-all ease-in-out duration-300`}
          >
            {isLoading ? "Creating Course..." : "Create Course"}
          </button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default CreateCourse;