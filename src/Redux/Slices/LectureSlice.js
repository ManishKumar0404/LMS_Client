import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance, { fileUploadConfig } from "../../Helper/axiosinstance.js";

const initialState = {
  lectures: [],
  loading: false,
  error: null,
};

// function to get all the lectures
export const getCourseLecture = createAsyncThunk(
  "/course/lecture/get",
  async (courseId) => {
    try {
      console.log("Fetching lectures for courseId:", courseId);

      // Change how we handle the promise and toast
      const res = await axiosInstance.get(`/courses/${courseId}/lectures`);

      console.log("Raw response:", res); // Debug full response

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch lectures");
      }

      toast.success("Lectures fetched successfully");
      return res.data;
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast.error(error?.response?.data?.message || "Failed to fetch lectures");
      throw error;
    }
  }
);

// function to add new lecture to the course
export const addCourseLectures = createAsyncThunk(
  "/course/lecture/add",
  async ({ id, formData }) => {
    try {
      const response = await axiosInstance.post(
        `/courses/${id}/lectures`,
        formData,
        {
          ...fileUploadConfig,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 60000,
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log('Upload Progress:', percentCompleted);
          }
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Lecture added successfully");
      return response.data;
    } catch (error) {
      console.error("Add lecture error:", error);
      if (error.code === 'ECONNABORTED') {
        toast.error("Upload timed out. Please try again with a smaller file or check your connection.");
      } else {
        toast.error(error?.response?.data?.message || "Failed to add lecture");
      }
      throw error;
    }
  }
);

// function to delete the lecture from the course
export const deleteCourseLecture = createAsyncThunk(
  "/course/lecture/delete",
  async (data) => {
    try {
      // Fix URL format - remove = sign
      const response = await axiosInstance.delete(
        `/courses/${data.courseId}/lectures/${data.lectureId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete lecture");
      }

      toast.success("Lecture deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Delete lecture error:", error);
      toast.error(error?.response?.data?.message || "Failed to delete lecture");
      throw error;
    }
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourseLecture.fulfilled, (state, action) => {
        state.lectures = action?.payload?.lectures || [];
      })
      .addCase(addCourseLectures.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCourseLectures.fulfilled, (state, action) => {
        state.loading = false;
        state.lectures = action.payload.lectures;
      })
      .addCase(addCourseLectures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCourseLecture.fulfilled, (state, action) => {
        state.lectures = action?.payload?.course?.lectures || [];
      });
  },
});

// export const {} = lectureSlice.actions;
export default lectureSlice.reducer;