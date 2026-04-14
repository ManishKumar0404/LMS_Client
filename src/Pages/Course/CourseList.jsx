import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCourses } from "../../Redux/Slices/CourseSlice";
import HomeLayout from "../../Layouts/HomeLayouts";
import CourseCard from "../../Components/CourseCard";

function CourseList() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { courseData } = useSelector((state) => state.course);

  // Debug log to check course data
  console.log("Course Data:", courseData);

  async function loadCourses() {
    try {
      setIsLoading(true);
      await dispatch(getAllCourses());
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, [dispatch]); // Added dispatch to dependency array

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 pl-20 flex flex-col gap-10 text-white">
        <h1 className="text-center text-3xl font-semibold mb-5">
          Explore the courses made by
          <span className="font-bold text-yellow-500 ml-2">
            Industry experts
          </span>
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center">
            Loading courses...
          </div>
        ) : courseData?.length > 0 ? (
          <div className="mb-10 flex flex-wrap gap-14 justify-center">
            {courseData.map((course) => (
              <CourseCard key={course._id} data={course} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            No courses found
          </div>
        )}
      </div>
    </HomeLayout>
  );
}

export default CourseList;