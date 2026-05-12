import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderService } from "../services/orderService";

export const placeOrderThunk = createAsyncThunk(
  "orders/place",
  async (orderData, { rejectWithValue }) => {
    try {
      return await orderService.placeOrder(orderData);
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const fetchMyOrdersThunk = createAsyncThunk(
  "orders/fetchMine",
  async () => orderService.getMyOrders()
);

export const fetchOrderThunk = createAsyncThunk(
  "orders/fetchOne",
  async (orderNumber) => orderService.getOrder(orderNumber)
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list:    [],
    current: null,
    loading: false,
    error:   null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderThunk.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(placeOrderThunk.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(placeOrderThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchMyOrdersThunk.fulfilled, (s, a) => { s.list    = a.payload; })
      .addCase(fetchOrderThunk.fulfilled,    (s, a) => { s.current = a.payload; });
  },
});

export default ordersSlice.reducer;