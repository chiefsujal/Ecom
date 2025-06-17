import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../store/Auth";

function ReviewForm({ productId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 && !review.trim()) {
      toast.error("Please provide at least a rating or a review");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("rating", rating);
      formData.append("review", review);
      if (image) {
        formData.append("image", image);
      }

      const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";
      await axios.post(`${BASE_URL}/api/reviews`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast.success("Review submitted successfully!");
      setRating(0);
      setReview("");
      setImage(null);
      onSubmit?.();
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to submit a review");
      } else {
        toast.error(error.response?.data?.error || "Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="font-medium">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="select select-bordered w-full"
          required
        >
          <option value={0}>Select Rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} ⭐
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-medium">Review (optional):</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="textarea textarea-bordered w-full"
          placeholder="Share your thoughts..."
          rows={4}
        />
      </div>

      <div>
        <label className="font-medium">Upload Image (optional):</label>
        <input 
          type="file" 
          accept="image/*"
          className="file-input file-input-bordered w-full" 
          onChange={handleImageChange} 
        />
        <p className="text-sm text-gray-500 mt-1">Max file size: 5MB</p>
      </div>

      <div className="modal-action">
        <button 
          className="btn btn-primary w-full" 
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
