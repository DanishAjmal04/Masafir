import { createSlice } from "@reduxjs/toolkit";

// localStorage se cart load karo
const loadCart = () => {
  try {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

// localStorage mein cart save karo
const saveCart = (items) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch {}
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCart(), // ← refresh pe bhi data rahega
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size && i.color === action.payload.color
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      saveCart(state.items); // ← har change pe save
    },

    removeFromCart(state, action) {
      state.items = state.items.filter(
        (i) => !(i.id === action.payload.id && i.size === action.payload.size)
      );
      saveCart(state.items);
    },

    updateQuantity(state, action) {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.size === action.payload.size
      );
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (i) => !(i.id === action.payload.id && i.size === action.payload.size)
          );
        }
      }
      saveCart(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveCart([]);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export default cartSlice.reducer;