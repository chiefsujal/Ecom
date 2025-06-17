import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import axios from "axios";
import { useAuth } from "../store/Auth";
import ReviewForm from "../components/ReviewForm";
import { ArrowLeftIcon, StarIcon } from "lucide-react";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProduct, currentProduct } = useProductStore();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "";
      const res = await axios.get(`${BASE_URL}/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchProduct(id), fetchReviews()]);
      } catch (error) {
        console.error("Error loading product details:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleReviewSubmit = async () => {
    await Promise.all([fetchProduct(id), fetchReviews()]);
  };

  const isAdmin = user && user.isAdmin;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="alert alert-error">Product not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-ghost mb-6"
      >
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products
      </button>

      {isAdmin && (
        <button
          className="btn btn-primary mb-6 ml-4"
          onClick={() => navigate(`/product/${id}/edit`)}
        >
          Edit Product
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-full h-96 object-cover"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{currentProduct.name}</h1>
          
          <div className="flex items-center gap-2 text-2xl font-bold text-primary">
            <span>₹{Number(currentProduct.price).toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-2 text-yellow-600">
            <StarIcon className="size-5" />
            <span className="font-semibold">
              {Number(currentProduct.average_rating)
                ? Number(currentProduct.average_rating).toFixed(1)
                : "N/A"}
            </span>
            <span className="text-gray-500">
              ({currentProduct.review_count || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {user && (
          <div className="mb-8">
            <ReviewForm productId={id} onSubmit={handleReviewSubmit} />
          </div>
        )}

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-8 bg-base-200 rounded-lg">
              <p className="text-gray-500">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-base-100 rounded-lg shadow-md p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span>{review.username?.[0]?.toUpperCase() || "A"}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold">{review.username || "Anonymous"}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {review.rating && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <StarIcon className="size-4" />
                      <span>{review.rating}</span>
                    </div>
                  )}
                </div>

                {review.review && (
                  <p className="text-gray-700">{review.review}</p>
                )}

                {review.image_url && (
                  <div className="mt-4">
                    <img
                      src={review.image_url}
                      alt="Review"
                      className="max-h-48 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
