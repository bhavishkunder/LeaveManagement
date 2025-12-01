import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

const getAuthHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const applyLeave = createAsyncThunk("leave/apply", async ({ data, token }) => {
  const response = await axios.post(`${API_URL}/leaves`, data, getAuthHeader(token))
  return response.data
})

export const getMyRequests = createAsyncThunk("leave/myRequests", async (token) => {
  const response = await axios.get(`${API_URL}/leaves/my-requests`, getAuthHeader(token))
  return response.data
})

export const cancelRequest = createAsyncThunk("leave/cancel", async ({ id, token }) => {
  const response = await axios.delete(`${API_URL}/leaves/${id}`, getAuthHeader(token))
  return response.data
})

export const getBalance = createAsyncThunk("leave/balance", async (token) => {
  const response = await axios.get(`${API_URL}/leaves/balance`, getAuthHeader(token))
  return response.data
})

export const getAllRequests = createAsyncThunk("leave/allRequests", async (token) => {
  const response = await axios.get(`${API_URL}/leaves/all`, getAuthHeader(token))
  return response.data
})

export const getPendingRequests = createAsyncThunk("leave/pending", async (token) => {
  const response = await axios.get(`${API_URL}/leaves/pending`, getAuthHeader(token))
  return response.data
})

export const approveLeave = createAsyncThunk("leave/approve", async ({ id, comment, token }) => {
  const response = await axios.put(`${API_URL}/leaves/${id}/approve`, { managerComment: comment }, getAuthHeader(token))
  return response.data
})

export const rejectLeave = createAsyncThunk("leave/reject", async ({ id, comment, token }) => {
  const response = await axios.put(`${API_URL}/leaves/${id}/reject`, { managerComment: comment }, getAuthHeader(token))
  return response.data
})

const leaveSlice = createSlice({
  name: "leave",
  initialState: {
    requests: [],
    balance: null,
    pendingRequests: [],
    allRequests: [],
    loading: false,
    error: null,
    success: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(applyLeave.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(applyLeave.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(applyLeave.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(getMyRequests.fulfilled, (state, action) => {
        state.requests = action.payload
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.success = true
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.balance = action.payload
      })
      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.pendingRequests = action.payload
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.allRequests = action.payload
      })
      .addCase(approveLeave.fulfilled, (state) => {
        state.success = true
      })
      .addCase(rejectLeave.fulfilled, (state) => {
        state.success = true
      })
  },
})

export default leaveSlice.reducer
