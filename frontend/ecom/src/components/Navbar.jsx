import { Link, useLocation } from "react-router-dom";
import { ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";
import { useProductStore } from "../store/useProductStore";
import { useAuth } from "../store/Auth";


function Navbar() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const { products } = useProductStore();
  const { isLoggedIn, LogoutUser } = useAuth();

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4rem] justify-between">
        
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="size-9 text-primary" />
                <span
                  className="font-semibold font-mono tracking-widest text-2xl 
                    bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                >
                  Karigari
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="btn btn-outline btn-sm text-sm px-4">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm text-sm px-4">
                  Register
                </Link>
              </>
            ) : (
              <button onClick={LogoutUser} className="btn btn-outline btn-error btn-sm text-sm px-4">
                Logout
              </button>
            )}

            {isHomePage && (
              <div className="indicator">
                <div className="p-2 rounded-full hover:bg-base-200 transition-colors">
                  <ShoppingBagIcon className="size-5" />
                  <span className="badge badge-sm badge-primary indicator-item">
                    {products.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
