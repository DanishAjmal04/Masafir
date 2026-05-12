import api from "./api";

export const orderService = {
  placeOrder: (data) =>
    api.post("/orders/place/", data).then((r) => r.data),

  getMyOrders: () =>
    api.get("/orders/").then((r) => r.data),

  getOrder: (orderNumber) =>
    api.get(`/orders/${orderNumber}/`).then((r) => r.data),

  cancelOrder: (orderNumber) =>
    api.post(`/orders/${orderNumber}/cancel/`).then((r) => r.data),
};