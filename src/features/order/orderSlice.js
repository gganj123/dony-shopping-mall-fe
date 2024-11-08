import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartList, getCartQty } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";
import { cat } from "@cloudinary/url-gen/qualifiers/focusOn";
import { act } from "react";

// Define initial state
const initialState = {
  orderList: [],
  orderNum: "",
  selectedOrder: {},
  error: "",
  loading: false,
  totalPageNum: 1,
};

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", payload);
      if (response.status !== 200) throw new Error(response.error);
      dispatch(getCartQty());
      return response.data.orderNum;
    } catch (error) {
      dispatch(showToastMessage({ message: error.error, status: "error" }));
      return rejectWithValue(error.error);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("order/user");
      if (response.status !== 200) throw new Error(response.error);
      return response.data;
    } catch (error) {
      dispatch(showToastMessage({ message: error.error, status: "error" }));
      return rejectWithValue(error.error);
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get(`/order/admin/`, { params: query });
      if (response.status !== 200) throw new Error(response.error);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {}
);

// Order slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.orderNum = action.payload;
    });

    builder.addCase(createOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getOrder.pending, (state, action) => {
      state.loading = true;
    });

    builder.addCase(getOrder.fulfilled, (state, action) => {
      state.loading = true;
      state.error = "";
      state.orderList = action.payload.data;
    });

    builder.addCase(getOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.orderList = "";
    });
    builder.addCase(getOrderList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getOrderList.fulfilled, (state, action) => {
      state.loading = false;
      state.orderList = action.payload.data;
      console.log(state.orderList);
      state.error = "";
      state.totalPageNum = action.payload.totalPageNum;
    });
    builder.addCase(getOrderList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.orderList = "";
    });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
