import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { PackageIcon, PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import ProductCard from "../components/ProductCard";
import AddProductModal from "../components/AddProductModal";
import { useAuth } from "../store/Auth";

function HomePage() {
  const { products, loading, error, fetchProducts, addProductToStore } = useProductStore();
  const { user } = useAuth();
  const isAdmin = user && user.isAdmin;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (newProduct) => {
    try {
      await addProductToStore(newProduct);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById("add_product_modal").showModal()}
            aria-label="Add Product"
          >
            <PlusCircleIcon className="size-5 mr-2" />
            Add Product
          </button>
        )}
        <button
          className="btn btn-ghost btn-circle"
          onClick={fetchProducts}
          aria-label="Refresh Products"
        >
          <RefreshCwIcon className="size-5" />
        </button>
      </div>

      {isAdmin && <AddProductModal onAddProduct={handleAddProduct} />} 

      {error && <div className="alert alert-error mb-8">{error}</div>}

      {!loading && products.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <PackageIcon className="size-12" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold">No products found</h3>
            <p className="text-gray-500 max-w-sm">
              Get started by adding your first product to the inventory
            </p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default HomePage;
