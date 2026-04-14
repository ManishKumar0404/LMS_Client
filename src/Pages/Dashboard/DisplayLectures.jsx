import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayouts";
import {
    deleteCourseLecture,
  getCourseLecture,
} from "../../Redux/Slices/LectureSlice";

const DisplayLectures = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // for getting the data from location of previous component
  const courseDetails = useLocation().state;
  const { lectures } = useSelector((state) => state.lecture);
  const { role } = useSelector((state) => state.auth);

  // to play the video accordingly
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // function to handle lecture delete
  const handleLectureDelete = async (courseId, lectureId) => {
    const data = { courseId, lectureId };
    console.log(`/courses/${courseId}`);
    console.log(`/courses/${data.id}/lectures`);

    await dispatch(deleteCourseLecture(data));
    await dispatch(getCourseLecture(courseDetails._id));
    console.log("Fetching lectures for courseId:", courseDetails._id);
  };

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLectures() {
      try {
        setIsLoading(true);
        setError(null);
        console.log("Fetching lectures for course:", courseDetails?._id);
        const result = await dispatch(getCourseLecture(courseDetails?._id)).unwrap();
        console.log("Fetch result:", result);
      } catch (err) {
        console.error("Failed to fetch lectures:", err);
        setError(err.message || "Failed to load lectures");
      } finally {
        setIsLoading(false);
      }
    }

    if (courseDetails?._id) {
      fetchLectures();
    } else {
      setError("No course ID found");
      console.error("No course ID available");
    }
  }, [dispatch, courseDetails?._id]);

  if (!courseDetails?._id) {
    return (
      <HomeLayout>
        <div className="text-white text-center mt-10">
          No course selected. Please select a course first.
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <div className="flex flex-col gap-10 items-center justify-center min-h-[90vh] py-10 text-white mx-[5%]">
        {/* displaying the course name */}
        <h1 className="text-center text-2xl font-semibold text-yellow-500">
          Course Name : {courseDetails?.title}
        </h1>

        {isLoading && (
          <div className="text-center">Loading lectures...</div>
        )}

        {error && (
          <div className="text-red-500 text-center">
            Error: {error}
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex justify-center gap-10 w-full">
            {/* left section for playing the video and displaying course details to admin */}
            <div className="space-y-5 w-[28rem] p-2 rounded-lg shadow-[0_0_10px_aqua]">
              <video
                className="object-fill rounded-tl-lg rounded-tr-lg w-full"
                src={lectures?.[currentVideoIndex]?.lecture?.secure_url || ""}
                controls
                disablePictureInPicture
                muted
                controlsList="nodownload"
              />

              <div>
                <h1>
                  <span className="text-yellow-500">Title : </span>
                  {lectures && lectures[currentVideoIndex]?.title}
                </h1>
                <p>
                  {" "}
                  <span className="text-yellow-500 line-clamp-4">
                    Description :{" "}
                  </span>
                  {lectures && lectures[currentVideoIndex]?.description}
                </p>
              </div>
            </div>

            {/* right section for displaying all the lectures of the course */}
            <ul className="w-[28rem] p-2 rounded-lg shadow-[0_0_10px_aqua] space-y-4">
              <li className="font-semibold text-xl text-yellow-500 flex items-center justify-between">
                <p>Lectures List</p>
                {role === "ADMIN" && (
                  <button
                    onClick={() =>
                      navigate("/course/addlecture", {
                        state: { ...courseDetails },
                      })
                    }
                    className="btn-primary px-2 py-1 rounded-md font-semibold text-sm"
                  >
                    Add New Lecture
                  </button>
                )}
              </li>
              {lectures &&
                lectures.map((element, index) => {
                  return (
                    <li className="space-y-2" key={element._id}>
                      <p
                        className="cursor-pointer"
                        onClick={() => setCurrentVideoIndex(index)}
                      >
                        <span className="text-yellow-500">
                          {" "}
                          Lecture {index + 1} :{" "}
                        </span>
                        {element?.title}
                      </p>
                      {role === "ADMIN" && (
                        <button
                          onClick={() =>
                            handleLectureDelete(courseDetails?._id, element?._id)
                          }
                          className="btn-primary px-2 py-1 rounded-md font-semibold text-sm"
                        >
                          Delete Lecture
                        </button>
                      )}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    </HomeLayout>
  );
};

export default DisplayLectures;