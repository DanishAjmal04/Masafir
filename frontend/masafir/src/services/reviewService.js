import api from "./api";

export const reviewService = {
  getReviews: (slug) =>
    api.get(`/reviews/${slug}/`).then((r) => r.data),

  createReview: (slug, data) =>
    api.post(`/reviews/${slug}/create/`, data).then((r) => r.data),

  deleteReview: (id) =>
    api.delete(`/reviews/${id}/manage/`),
};