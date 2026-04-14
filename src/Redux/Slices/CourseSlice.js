import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from "../../Helper/axiosinstance.js"
import {toast} from 'react-hot-toast';


const initialState = {
    courseData: []
}

// function to get all courses
export const getAllCourses = createAsyncThunk("/course/getAll", async () => {
    try {
        const res = await axiosInstance.get("/courses");

        const response = await res;
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        throw error;
    }
});

export const deleteCourse = createAsyncThunk("/course/delete", async (id) => {
    try {
        const response = await axiosInstance.delete(`/courses/${id}`);

        if (response.data.success) {
            toast.success("Course deleted successfully");
        }

        return { success: true, id }; // Return the deleted course ID
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to delete course");
        throw error;
    }
});

export const createNewCourse = createAsyncThunk("/course/create", async (formData, { rejectWithValue }) => {
    try {
        const response = await toast.promise(
            axiosInstance.post("/courses", formData, {
                headers: { "Content-Type": "multipart/form-data" }, // Ensure correct content type
            }),
            {
                loading: "Creating new course...",
                success: "Course created successfully!",
                error: "Failed to create course",
            }
        );

        return response.data;

    } catch (error) {
        console.error("Create Course Error:", error?.response?.data); // Log error response
        toast.error(error?.response?.data?.message || "An unexpected error occurred");
        return rejectWithValue(error?.response?.data || "Failed to create course");
    }
});

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCourses.fulfilled, (state, action) => {
                if (action.payload?.courses) {
                    state.courseData = action.payload.courses.map(course => ({
                        ...course,
                        numberOfLectures: course.numberOfLectures || course.lectures?.length || 0
                    }));
                }
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                // Remove the deleted course from state
                state.courseData = state.courseData.filter(
                    course => course._id !== action.payload.id
                );
            })
            .addCase(createNewCourse.fulfilled, (state, action) => {
                state.courseData = [...state.courseData, 
                    { ...action.payload.course, numberOfLectures: 0 }
                ];
            });
    }
})

export default courseSlice.reducer;