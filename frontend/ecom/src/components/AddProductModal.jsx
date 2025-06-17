import { DollarSignIcon, ImageIcon, Package2Icon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";

function AddProductModal({ onAddProduct }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAddProduct(formData); 
      setFormData({ name: "", price: "", image: "" }); 
      document.getElementById("add_product_modal")?.close();
    } catch (error) {
      console.error("Failed to add product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog id="add_product_modal" className="modal">
      <div className="modal-box relative">
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => document.getElementById("add_product_modal").close()}
        >
          ✕
        </button>

        <h3 className="font-bold text-xl mb-6">Add New Product</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Product Name</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/50">
                <Package2Icon className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                placeholder="Enter product name"
                className="input input-bordered w-full pl-10 py-3 focus:input-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Price</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/50">
                <DollarSignIcon className="w-5 h-5" />
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                className="input input-bordered w-full pl-10 py-3 focus:input-primary"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Image URL</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-base-content/50">
                <ImageIcon className="w-5 h-5" />
              </div>
              <input
                type="url"
                required
                placeholder="https://example.com/image.jpg"
                className="input input-bordered w-full pl-10 py-3 focus:input-primary"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
          </div>
          <div className="modal-action flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => document.getElementById("add_product_modal").close()}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary min-w-[120px]"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <PlusCircleIcon className="w-5 h-5 mr-2" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div
        className="modal-backdrop"
        onClick={() => document.getElementById("add_product_modal").close()}
      />
    </dialog>
  );
}

export default AddProductModal;
