import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  error: null, // Thêm trường để lưu lỗi
};

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Thêm sản phẩm mới
export const addNewProduct = createAsyncThunk(
  "products/addNewProduct", // Khóa mô tả
  async (formData, { rejectWithValue }) => {
    try {
      const result = await axios.post(`${BASE_URL}/api/admin/products/add`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Thêm sản phẩm thất bại");
    }
  }
);

// Lấy danh sách sản phẩm
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await axios.get(`${BASE_URL}/api/admin/products/get`);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Lấy danh sách thất bại");
    }
  }
);

// Sửa sản phẩm
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const result = await axios.put(`${BASE_URL}/api/admin/products/edit/${id}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Sửa sản phẩm thất bại");
    }
  }
);

// Xóa sản phẩm
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const result = await axios.delete(`${BASE_URL}/api/admin/products/delete/${id}`);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Xóa sản phẩm thất bại");
    }
  }
);

// Slice quản lý sản phẩm
const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Trạng thái khi lấy danh sách sản phẩm
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Có lỗi xảy ra khi lấy danh sách sản phẩm";
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload || "Có lỗi xảy ra";
        }
      );
  },
});

export default adminProductsSlice.reducer;
