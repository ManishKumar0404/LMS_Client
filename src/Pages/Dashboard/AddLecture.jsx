import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayouts";
import { addCourseLectures } from "../../Redux/Slices/LectureSlice";

const AddLectures = () => {
  const courseDetails = useLocation().state;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState({
    id: courseDetails?._id,
    lecture: undefined,
    title: "",
    description: "",
    videoSrc: "",
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // function to handle the input box change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInput({ ...userInput, [name]: value });
  };

  // function to get video and its link from the input
  const getVideo = (event) => {
    const video = event.target.files[0];
    const source = window.URL.createObjectURL(video);
    setUserInput({ ...userInput, videoSrc: source, lecture: video });
  };

  // function to handle the form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!userInput.lecture || !userInput.title || !userInput.description) {
      toast.error("All fields are mandatory");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("lecture", userInput.lecture);
      formData.append("title", userInput.title);
      formData.append("description", userInput.description);

      const res = await dispatch(
        addCourseLectures({
          id: courseDetails._id,
          formData,
        })
      ).unwrap();

      if (res?.success) {
        toast.success("Lecture added successfully");
        setUserInput({
          id: courseDetails?._id,
          lecture: undefined,
          title: "",
          description: "",
          videoSrc: "",
        });
        // Navigate to the DisplayLectures page with course details
        navigate(`/course/displaylectures`, { state: courseDetails });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error?.message || "Failed to add lecture");
    } finally {
      setIsUploading(false);
    }
  };

  // redirecting the user if no user details
  useEffect(() => {
    if (!courseDetails) {
      navigate(-1);
    }
  }, []);
  return (
    <HomeLayout>
      {isUploading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      <div className=" text-white flex flex-col items-center justify-center gap-10 mx-16 min-h-[90vh]">
        <div className="flex flex-col gap-5 p-2 shadow-[0_0_10px_pink] w-96 rounded-lg">
          <header className="flex items-center justify-center relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-2 text-xl text-green-500"
            >
              <AiOutlineArrowLeft />
            </button>
            <h1 className="text-xl text-yellow-500 font-semibold">
              Add your new lecture
            </h1>
          </header>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="title"
              value={userInput.title}
              onChange={handleInputChange}
              placeholder="Enter the title for lecture"
              className="bg-transparent px-3 py-1 border shadow-[0_0_10px_white]"
            />

            <textarea
              name="description"
              value={userInput.description}
              onChange={handleInputChange}
              placeholder="Enter the description for lecture"
              className="resize-none overflow-y-scroll h-24 bg-transparent px-3 py-1 shadow-[0_0_10px_white]"
            />
            {userInput.videoSrc ? (
              <video
                src={userInput.videoSrc}
                muted
                controls
                controlsList="nodownload nofullscreen"
                disablePictureInPicture
                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
              ></video>
            ) : (
              <div className="h-48 border flex items-center justify-center cursor-pointer">
                <label
                  htmlFor="lecture"
                  className="font-semibold text-xl cursor-pointer"
                >
                  Choose your video
                </label>
                <input
                  type="file"
                  name="lecture"
                  id="lecture"
                  onChange={getVideo}
                  accept="video/mp4,video/x-m4v,video/*"
                  className="hidden "
                />
              </div>
            )}

            <button className="btn-primary py-1 font-semibold text-lg shadow-[0_0_10px_pink]">
              Add Lecture
            </button>
          </form>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AddLectures;