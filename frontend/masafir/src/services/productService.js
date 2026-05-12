import api from "./api";

export const productService = {
  // Sari products — filters ke saath
  getProducts: (params = {}) =>
    api.get("/products/", { params }).then((r) => r.data),

  // Single product detail
  getProduct: (slug) =>
    api.get(`/products/${slug}/`).then((r) => r.data),

  // Featured products — homepage ke liye
  getFeatured: () =>
    api.get("/products/featured/").then((r) => r.data),

  // New arrivals
  getNewArrivals: () =>
    api.get("/products/new-arrivals/").then((r) => r.data),

  // Categories
  getCategories: () =>
    api.get("/products/categories/").then((r) => r.data),
};