import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 });

      dispatch(
        showToastMessage({
          message: "카트에 아이템이 추가됐습니다.",
          status: "success",
        })
      );
      return response.data.cartItemsQty;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.error,
          status: "error",
        })
      );
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete(`/cart/${id}`);

      dispatch(
        showToastMessage({ message: "상품 삭제 완료", status: "success" })
      );
      dispatch(getCartList());
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/cart/${id}`, { qty: value });
      dispatch(getCartList());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("cart/qty");
      return response.data.qty;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.cartItemCount = action.payload;
      console.log(state.cartItemCount);
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getCartList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getCartList.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.cartList = action.payload.data.items.map((item) => {
        const stockCount = item.productId.stock[item.size] || 0;
        return {
          ...item,
          qty: stockCount === 0 ? 0 : item.qty, // 재고가 0인 경우 수량도 0으로 설정
        };
      });
      console.log(state.cartList);
      state.totalPrice = action.payload.data.items.reduce(
        (total, item) => total + item.productId.price * item.qty,
        0
      );
      state.cartItemCount = action.payload.data.items.length; // 아이템 수로 cartItemCount 업데이트
    });
    builder.addCase(getCartList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.cartItemCount = 0;
    });
    builder.addCase(deleteCartItem.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteCartItem.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
    });
    builder.addCase(deleteCartItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateQty.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateQty.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      const updatedItem = action.payload;
      //TODO 여기부터 수정
    });
    builder.addCase(updateQty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getCartQty.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getCartQty.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.cartItemCount = action.payload;
    });
    builder.addCase(getCartQty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
