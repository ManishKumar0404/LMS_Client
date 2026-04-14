import { configureStore } from "@reduxjs/toolkit"
import authSliceReducer from './AuthSlice.js';
import CourseSliceReducer from './CourseSlice.js'
import razorpaySliceReducer from './RazorpaySlice.js'
import lectureSliceReducer from './LectureSlice.js'
import statSliceReducer from './StatSlice.js'


const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        course: CourseSliceReducer,
        razorpay: razorpaySliceReducer,
        lecture: lectureSliceReducer,
        stats: statSliceReducer
    },
    devTools: true
})

export default store;