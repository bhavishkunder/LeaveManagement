import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const getEmployeeDashboard = createAsyncThunk("dashboard/employee", async (token) => {
  const response = await axios.get(`${API_URL}/dashboard/employee`, getAuthHeader(token))
  return response.data
})

export const getManagerDashboard = createAsyncThunk("dashboard/manager", async (token) => {
  const response = await axios.get(`${API_URL}/dashboard/manager`, getAuthHeader(token))
  return response.data
})

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    employeeStats: null,
    managerStats: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeDashboard.pending, (state) => {
        state.loading = true
      })
      .addCase(getEmployeeDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.employeeStats = action.payload
      })
      .addCase(getEmployeeDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getManagerDashboard.pending, (state) => {
        state.loading = true
      })
      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.loading = false
        state.managerStats = action.payload
      })
      .addCase(getManagerDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default dashboardSlice.reducer
