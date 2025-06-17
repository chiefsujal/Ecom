import React from "react";
import ReviewForm from "./ReviewForm";

function ReviewModal({ productId, onClose, onReviewSubmitted }) {
  return (
    <dialog id="review_modal" className="modal modal-open">
      <div className="modal-box relative">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-4">Rate & Review Product</h3>
        <ReviewForm
          productId={productId}
          onSubmit={() => {
            onReviewSubmitted();
            onClose();
          }}
        />
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </dialog>
  );
}

export default ReviewModal;
