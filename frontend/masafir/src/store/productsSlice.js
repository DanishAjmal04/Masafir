import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../services/productService";

export const fetchProductsThunk = createAsyncThunk(
  "products/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const data = await productService.getProducts(params);
      // Django paginated response handle karo
      return Array.isArray(data) ? data : data.results || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to load products");
    }
  }
);

export const fetchProductThunk = createAsyncThunk(
  "products/fetchOne",
  async (slug, { rejectWithValue }) => {
    try {
      return await productService.getProduct(slug);
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Product not found");
    }
  }
);

export const fetchFeaturedThunk = createAsyncThunk(
  "products/featured",
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getFeatured();
      return Array.isArray(data) ? data : data.results || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to load featured");
    }
  }
);

export const fetchNewArrivalsThunk = createAsyncThunk(
  "products/newArrivals",
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getNewArrivals();
      return Array.isArray(data) ? data : data.results || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || "Failed to load new arrivals");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    list:        [],
    featured:    [],
    newArrivals: [],
    current:     null,
    loading:     false,
    error:       null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsThunk.pending,   (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProductsThunk.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; })
      .addCase(fetchProductsThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchProductThunk.pending,   (s) => { s.loading = true; s.current = null; s.error = null; })
      .addCase(fetchProductThunk.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchProductThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      .addCase(fetchFeaturedThunk.fulfilled,    (s, a) => { s.featured    = a.payload; })
      .addCase(fetchNewArrivalsThunk.fulfilled, (s, a) => { s.newArrivals = a.payload; });
  },
});

export default productsSlice.reducer;