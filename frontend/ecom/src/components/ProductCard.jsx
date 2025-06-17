import React, { useState } from "react";
import { MessageCircleIcon, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/Auth";
import ReviewModal from "./ReviewModel";
import { useProductStore } from "../store/useProductStore";
import toast from "react-hot-toast";

function ProductCard({ product }) {
  const { isLoggedIn } = useAuth();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  const onReviewSubmitted = () => {
    fetchProducts();
    toast.success("Review submitted successfully!");
  };

  const handleReviewClick = () => {
    if (!isLoggedIn) {
      toast.error("Please login to rate and review products");
      return;
    }
    setShowReviewModal(true);
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <figure className="relative pt-[56.25%]">
        <img
          src={product.image}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </figure>

      <div className="card-body">
        <h2 className="card-title text-lg font-semibold">{product.name}</h2>
        <p className="text-2xl font-bold text-primary">
          ₹{Number(product.price).toFixed(2)}
        </p>

        <div className="flex items-center gap-2 text-sm text-yellow-600 mt-2">
          <StarIcon size={16} />
          {product.average_rating ? product.average_rating.toFixed(1) : "0.0"}
          <span className="text-gray-500 ml-1">({product.review_count || 0})</span>
        </div>

        <div className="card-actions mt-4 justify-between">
          <Link
            to={`/product/${product.id}`}
            className="btn btn-sm btn-warning btn-outline"
          >
            <MessageCircleIcon size={16} className="mr-1" />
            View Details
          </Link>

          <button
            onClick={handleReviewClick}
            className="btn btn-sm btn-primary"
          >
            <StarIcon size={16} className="mr-1" />
            Rate & Review
          </button>
        </div>
      </div>

      {showReviewModal && (
        <ReviewModal
          productId={product.id}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={onReviewSubmitted}
        />
      )}
    </div>
  );
}

export default ProductCard;
