import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosinstance";

const initialState = {
    allUserCount: 0,
    subscribedCount: 0,
    loading: false,
    error: null
};

export const getStatData = createAsyncThunk("stat/get", async (_, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.get("/admin/stats/users");
        return response.data;
    } catch (error) {
        console.error("Stats Fetch Error:", error);
        return rejectWithValue(error?.response?.data?.message || "Failed to fetch stats");
    }
});

const statSlice = createSlice({
    name: "stats",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStatData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getStatData.fulfilled, (state, action) => {
                state.loading = false;
                state.allUserCount = action.payload.allUserCount;
                state.subscribedCount = action.payload.subscribedUsersCount;
                state.error = null;
            })
            .addCase(getStatData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch stats";
            });
    }
});

export default statSlice.reducer;
