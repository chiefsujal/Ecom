import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  currentProduct: null,

  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  // ✅ Form-based product addition (used inside modal form directly)
  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      get().resetForm();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal")?.close();
    } catch (error) {
      console.error("Error in addProduct:", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Data-based product addition (used by HomePage `onAddProduct`)
  addProductToStore: async (newProduct) => {
    set({ loading: true });

    try {
      await axios.post(`${BASE_URL}/api/products`, newProduct);
      await get().fetchProducts();
      toast.success("Product added successfully");
      document.getElementById("add_product_modal")?.close();
    } catch (error) {
      console.error("Error in addProductToStore:", error);
      toast.error("Something went wrong while adding product");
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Fetch all products
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      console.error("Error in fetchProducts:", err);
      const message = err.response?.status === 429 ? "Rate limit exceeded" : "Something went wrong";
      set({ error: message, products: [] });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Submit review for a product
  addReview: async (productId, reviewData) => {
    set({ loading: true });
    try {
      await axios.post(`${BASE_URL}/api/products/${productId}/reviews`, reviewData);
      await get().fetchProducts(); // Refresh product list to get updated ratings
      toast.success("Review submitted successfully");
    } catch (error) {
      console.error("Error in addReview:", error);
      toast.error("Failed to submit review");
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Delete a product by ID
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error in deleteProduct:", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Fetch single product by ID
  fetchProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data,
        error: null,
      });
    } catch (error) {
      console.error("Error in fetchProduct:", error);
      set({ error: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Update product by ID
  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      await axios.put(`${BASE_URL}/api/products/${id}`, formData);
      await get().fetchProducts();
      set({ currentProduct: null });
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error in updateProduct:", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Sorting helpers
  sortByRating: () =>
    set((state) => ({
      products: [...state.products].sort(
        (a, b) => (b.average_rating || 0) - (a.average_rating || 0)
      ),
    })),

  sortByReviews: () =>
    set((state) => ({
      products: [...state.products].sort(
        (a, b) => (b.review_count || 0) - (a.review_count || 0)
      ),
    })),
}));
