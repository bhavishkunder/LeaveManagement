import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import leaveReducer from "./slices/leaveSlice"
import dashboardReducer from "./slices/dashboardSlice"

export default configureStore({
  reducer: {
    auth: authReducer,
    leave: leaveReducer,
    dashboard: dashboardReducer,
  },
})
