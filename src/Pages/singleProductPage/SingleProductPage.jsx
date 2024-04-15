import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../components/firebase/FireBase";
import { AuthContext } from "../../context/AuthContext";
import "./singleProductPage.css";
export const SingleProductPage = () => {
  const { productId } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDocRef = doc(db, "products", productId);
        const productDocSnap = await getDoc(productDocRef);

        if (productDocSnap.exists()) {
          const productDetails = {
            id: productDocSnap.id,
            ...productDocSnap.data(),
          };

          setProductDetails(productDetails);
        } else {
          console.error(`Product with ID ${productId} not found.`);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!productDetails) {
    return <p>Loading...</p>;
  }

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
    <div className="singleProductsContainer">
      <div className="productContainer">
        <div className="productLeftSection">
          <img src={productDetails.productImage} alt="" />
        </div>
        <div className="productRightSection">
          <h1>{productDetails.productName}</h1>
          <p>
            {" "}
            {productDetails.productDescription} Lorem ipsum dolor, sit amet
            consectetur adipisicing elit. Animi minima porro similique.
            Accusantium sed earum similique cum, ut quo architecto consequatur
            quae fuga optio et repudiandae nihil repellat inventore. Esse? Lorem
            ipsum dolor sit amet consectetur adipisicing elit. Laudantium,
            voluptas quam molestiae nihil earum iste quasi possimus asperiores
            qui labore optio pariatur animi voluptatem sequi blanditiis ipsam
            fugit delectus totam. Lorem, ipsum dolor sit amet consectetur a
            fugit delectus totam. Lorem, ipsum dolor sit amet consectetur a
            fugit delectus totam. Lorem, ipsum dolor sit amet consectetur a
            fugit delectus totam. Lorem, ipsum dolor sit amet consectetur a
            fugit delectus totam. Lorem, ipsum dolor sit amet consectetur a
            fugit delectus totam. Lorem, ipsum dolor sit amet consectetur a
            fugit delectus totam. Lorem, ipsum dolor sit amet consectetur a
            fugit delectus totam. Lorem, ipsum dolor sit amet consectetur a
            fugit delectus totam. Lorem, ipsum dolor sit amet consectetur a
          </p>

          <h1>${productDetails.productPrice}</h1>
          <button onClick={() => addToCart(productDetails)}>Add to cart</button>
        </div>
      </div>
    </div>
  );
};
