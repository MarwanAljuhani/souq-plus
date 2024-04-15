import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../../components/firebase/FireBase";
import { AuthContext } from "../../context/AuthContext";
import { Cart } from "../cart/Cart";
import "./navbar.css";

export const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0); // State to hold the cart item count

  const navigate = useNavigate();

  useEffect(() => {
  
    if (currentUser) {
      const cartRef = doc(db, "cart", currentUser.uid);

      const unsubscribe = onSnapshot(cartRef, (cartSnapshot) => {
        if (cartSnapshot.exists()) {
          const productIds = cartSnapshot.data().productIds;
          setCartItemCount(productIds.length); // Update cart item count
        } else {
          setCartItemCount(0); // Set cart item count to 0 if cart doesn't exist
        }
      });

      return () => unsubscribe(); // Unsubscribe from snapshot listener when component unmounts
    } else {
      setCartItemCount(0); // Set cart item count to 0 if currentUser is null
    }
  }, [currentUser]);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleProfileMenuClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        // Redirect to the sign-up page after successful logout
        navigate("/signup");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <div className="navbarContainer">
      <div className="leftSection">
        <h1>Souq+</h1>
      </div>
      <div className="middleSection">
        <NavLink exact to="/" className="navLinks">
          HOME
        </NavLink>
        <NavLink exact to="/products" className="navLinks">
          PRODUCTS
        </NavLink>
        <NavLink exact to="/about" className="navLinks">
          ABOUT
        </NavLink>
        <NavLink exact to="/support" className="navLinks">
          SUPPORT
        </NavLink>
      </div>
      <div className="rightSection">
        {currentUser && (
          <div>
            <img
              src={currentUser.photoURL}
              alt=""
              className="userImg"
              onClick={handleProfileMenuClick}
            />
            {isProfileMenuOpen && (
              <div className="profileMenu">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
        <div className="cartItemCount">{cartItemCount}</div>{" "}
        <ShoppingCartIcon className="cartIcon" onClick={handleCartClick} />
        <MenuIcon />
        <Cart isOpen={isCartOpen} onClose={handleCartClose} />
      </div>
    </div>
  );
};
