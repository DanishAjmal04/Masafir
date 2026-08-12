import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsThunk, fetchProductThunk, fetchFeaturedThunk, fetchNewArrivalsThunk } from "../store/productsSlice";

export function useProducts(params = {}) {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProductsThunk(params));
  }, [JSON.stringify(params)]);

  return { products: list, loading, error };
}

export function useProduct(slug) {
  const dispatch = useDispatch();
  const { current, loading, error } = useSelector((s) => s.products);

  useEffect(() => {
    if (slug) dispatch(fetchProductThunk(slug));
  }, [slug]);

  return { product: current, loading, error };
}

export function useFeaturedProducts() {
  const dispatch = useDispatch();
  const { featured } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchFeaturedThunk());
  }, []);

  return featured;
}

export function useNewArrivals() {
  const dispatch = useDispatch();
  const { newArrivals } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchNewArrivalsThunk());
  }, []);

  return newArrivals;
}