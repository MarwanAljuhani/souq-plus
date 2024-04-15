// Cart.js
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { db } from "../../components/firebase/FireBase";
import { AuthContext } from "../../context/AuthContext";
import "./cart.css";

export const Cart = ({ isOpen, onClose }) => {
  const { currentUser } = useContext(AuthContext);
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (currentUser) {
          const cartRef = doc(db, "cart", currentUser.uid);

          // Subscribe to changes in the cart document
          const unsubscribe = onSnapshot(cartRef, (cartSnapshot) => {
            if (cartSnapshot.exists()) {
              const productIds = cartSnapshot.data().productIds;

              Promise.all(
                productIds.map(async (productId) => {
                  const productRef = doc(db, "products", productId);
                  const productSnapshot = await getDoc(productRef);

                  if (productSnapshot.exists()) {
                    return { id: productId, ...productSnapshot.data() };
                  } else {
                    console.error(`Product with ID ${productId} not found.`);
                    return null;
                  }
                })
              )
                .then((productsData) => setCartProducts(productsData))
                .catch((error) => {
                  setError(error.message);
                  console.error("Error fetching cart products: ", error);
                })
                .finally(() => setLoading(false));
            } else {
              console.error("Cart document does not exist.");
            }
          });

          // Unsubscribe when the component unmounts or user changes
          return () => unsubscribe();
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching cart products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [currentUser]);

  const removeFromCart = async (productId) => {
    try {
      const cartRef = doc(db, "cart", currentUser.uid);

      // Remove the product from the productIds array in the cart document
      await updateDoc(cartRef, {
        productIds: cartProducts
          .filter((product) => product.id !== productId)
          .map((product) => product.id),
      });
    } catch (error) {
      setError(error.message);
      console.error("Error removing product from cart: ", error);
    }
  };

  return (
    <div className={`cart ${isOpen ? "open" : ""}`}>
      <div className="cartHeader">
        <h6>Cart</h6>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <div className="cartProductsContainer">
        {cartProducts.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartProducts.map((product) => (
            <div key={product.id} className="productsContent">
              <div className="cartImgContainer">
                <img src={product.productImage} alt={product.productName} />
              </div>
              <h3 className="name">{product.productName}</h3>
              <h3 className="price">${product.productPrice}</h3>
              <button
                onClick={() => removeFromCart(product.id)}
                style={{ background: "darkred" }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
