import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';
import axiosInstance from "../../Helper/axiosinstance.js"


const safelyParseJSON = (json, fallback) => {
    try {
        const parsed = JSON.parse(json);
        return parsed || fallback;
    } catch (e) {
        return fallback;
    }
};

const initialState = {
    isLoggedIn: safelyParseJSON(localStorage.getItem('isLoggedIn'), false),
    role: localStorage.getItem('role') || "",
    data: safelyParseJSON(localStorage.getItem('data'), {})
};
export const createAccount = createAsyncThunk("/auth/signup", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("user/register", data, {
            headers: { "Content-Type": "multipart/form-data" }, // ✅ Ensure correct content type
            withCredentials: true,  // ✅ Ensure cookies are sent if needed
        });

        await toast.success(res?.data?.message || "Login successful!");

        return res.data;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "Failed to create account";
        toast.error(errorMessage);
        return rejectWithValue(errorMessage);
    }
});

export const login = createAsyncThunk("/auth/login", async (data, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("user/login", data, {
            headers: { "Content-Type": "application/json" }, // 🔥 Use JSON format
            withCredentials: true,
        });

        await toast.success(res?.data?.message || "Login successful!");

        return res.data;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "Invalid credentials!";
        toast.error(errorMessage);

        return rejectWithValue(error?.response?.data);
    }
});

export const logout = createAsyncThunk("/auth/logout", async () => {
    try {
        const res = await axiosInstance.post("user/logout", {
            loading: "Wait authentication in progress...",
            success: (data) => {
                return data?.data?.message;
            },
            error: "Failed to log in"
        });

        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const updateProfile = createAsyncThunk(
    "/user/update/profile",
    async ([userId, formData], { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`user/update/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                const userData = response.data.user;
                return {
                    success: true,
                    message: "Profile updated successfully",
                    user: {
                        ...userData,
                        avatar: userData.avatar
                    }
                };
            }

            return rejectWithValue(response.data.message || "Update failed");
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || "Failed to update profile");
        }
    }
);

export const getUserData = createAsyncThunk("/user/details", async () => {
    try {
        const res = await axiosInstance.get("user/me")

        return res.data;
    } catch (error) {
        toast.error(error.message);
    }
})

export const changePassword = createAsyncThunk(
    "/auth/changePassword",
    async (passwords, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/change-password", passwords);
            toast.success("Password changed successfully");
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to change password");
            return rejectWithValue(error?.response?.data || error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetPasswordState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                console.log("Login Payload:", action.payload);
                console.log("User Role:", action.payload?.user?.role);

                state.isLoggedIn = true;
                state.role = action.payload?.user?.role || "USER";
                state.data = action.payload?.user || {};

                localStorage.setItem('isLoggedIn', JSON.stringify(true));
                localStorage.setItem('role', action.payload?.user?.role || "USER");
                localStorage.setItem('data', JSON.stringify(action.payload?.user || {}));
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.role = action.payload?.user?.role || "USER";
                state.data = action.payload?.user || {};
                localStorage.setItem('isLoggedIn', JSON.stringify(true));
                localStorage.setItem('role', action.payload?.user?.role || "USER");
                localStorage.setItem('data', JSON.stringify(action.payload?.user || {}));
            })
            .addCase(logout.fulfilled, (state) => {
                localStorage.clear();
                state.data = {};
                state.isLoggedIn = false;
                state.role = "";
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.role = action.payload?.user?.role || "USER";
                state.data = action.payload?.user || {};
                localStorage.setItem('isLoggedIn', JSON.stringify(true));
                localStorage.setItem('role', action.payload?.user?.role || "USER");
                localStorage.setItem('data', JSON.stringify(action.payload?.user || {}));
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                if (action.payload?.success) {
                    state.data = {
                        ...state.data,
                        ...action.payload.user
                    };
                    localStorage.setItem('data', JSON.stringify(state.data));
                }
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.loading = false;
                toast.success("Password changed successfully");
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to change password";
                toast.error(action.payload?.message || "Failed to change password");
            });
    }
});

export default authSlice.reducer;
