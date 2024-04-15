// ProductsPage.js
import React from "react";
import { Products } from "../../components/products/Products";
import { ProductsFilter } from "../../components/productsFilter/ProductsFilter";
import "./productsPage.css";

export const ProductsPage = () => {
  return (
    <div className="productsPageContainer">
   
      <Products />
    </div>
  );
};
