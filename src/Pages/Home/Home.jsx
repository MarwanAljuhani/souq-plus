import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useContext, useEffect, useState } from "react";
import "./home.css";
import { db } from "../../components/firebase/FireBase";
import "firebase/firestore";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../../context/AuthContext";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [randomProduct, setRandomProduct] = useState();
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsData);
      } catch (error) {
        setError(error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Call getRandomProduct whenever products state changes
    getRandomProduct();
  }, [products]);

  const getRandomProduct = () => {
    // Check if products array is not empty
    if (products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      const randomProduct = products[randomIndex];
      setRandomProduct(randomProduct);
      console.log("Random Product:", randomProduct);
    }
  };
  const addToCart = async (product) => {
    try {
      // Check if the currentUser is available
      if (!currentUser) {
        console.error("User not authenticated.");
        return;
      }
  
      const cartDocRef = doc(db, "cart", currentUser.uid);
      const cartDocSnap = await getDoc(cartDocRef);
  
      if (cartDocSnap.exists()) {
        // If the cart document exists, update the productIds array
        await updateDoc(cartDocRef, {
          productIds: arrayUnion(product.id),
          currentUser: currentUser.uid,
        });
      } else {
        // If the cart document doesn't exist, create a new one
        await setDoc(cartDocRef, {
          productIds: [product.id],
          currentUser: currentUser.uid,
        });
      }
  
      console.log("Product added to the cart!");
    } catch (error) {
      console.error("Error adding product to cart: ", error);
    }
  };

  return (
    <div>
      {error ? (
        <p>Error fetching data: {error.message}</p>
      ) : randomProduct ? (
        <div className="homeContainer">
          <div className="leftSection">
            <p>{randomProduct.productName}</p>
            <div className="leftBottomBox">
              <h6>Souq+</h6>
              <p>
             Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, pariatur doloribus aut ceat.
              </p>
            </div>
            <img src={randomProduct.productImage} alt="Random Product" />
            <h5 className="price">${randomProduct.productPrice}</h5>
          </div>

          <div className="rightSection">
            <div className="justDoIt">{randomProduct.productName}</div>
            <div className="rightBottomBox">
              <div className="text">
                <h6>Souq+</h6>
                <p>
                  Elevate your style with our latest collection
                </p>
              </div>
              <div className="rightArrow">
                <ArrowForwardIosIcon />
              </div>
            </div>
            <button onClick={() => addToCart(randomProduct)}>
              ADD TO CART
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
