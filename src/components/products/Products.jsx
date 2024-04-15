import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../components/firebase/FireBase";
import { AuthContext } from "../../context/AuthContext";
import { ProductsFilter } from "../productsFilter/ProductsFilter"; // Import the ProductsFilter component
import "./products.css";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    productName: "",
    minPrice: "",
    maxPrice: "",
    productType: "",
  });
  const { currentUser } = useContext(AuthContext);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredProducts = applyFilters(productsData);
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentUser, filters]); // Re-fetch when currentUser or filters change

  const addToCart = async (product) => {
    try {
      // Check if the currentUser is available
      if (!currentUser) {
        console.error("User not authenticated.");
        return;
      }

      const cartCollectionRef = collection(db, "cart"); // Reference to the cart collection
      const cartDocRef = doc(cartCollectionRef, currentUser.uid); // Reference to the cart document

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

  // Function to apply filters
  const applyFilters = (productsData) => {
    return productsData.filter((product) => {
      const { productName, minPrice, maxPrice, productType } = filters;

      // Check for each filter
      if (
        productName &&
        !product.productName.toLowerCase().includes(productName.toLowerCase())
      ) {
        return false;
      }

      const productPrice = parseFloat(product.productPrice);
      if (
        (minPrice && productPrice < parseFloat(minPrice)) ||
        (maxPrice && productPrice > parseFloat(maxPrice))
      ) {
        return false;
      }

      if (productType && product.productType !== productType) {
        return false;
      }

      return true;
    });
  };

  // Function to handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <ProductsFilter onApplyFilters={handleFilterChange} />
      <div className="productsContainer">
        {products.map((product) => (
          <div key={product.id} className="products">
            <Link
              to={`/product/${product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className="imgContainer">
                <img src={product.productImage} alt="" />
              </div>
            </Link>
            <div className="itemDetails">
              <h1>{product.productName}</h1>
              <p>{product.productType}</p>
              <h6>${product.productPrice}</h6>

              <AddShoppingCartIcon
                className="addCartIcon"
                onClick={() => addToCart(product)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
