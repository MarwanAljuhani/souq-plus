import React, { useState } from "react";
import "./productsFilter.css";

export const ProductsFilter = ({ onApplyFilters }) => {
  const [filters, setFilters] = useState({
    productName: "",
    minPrice: "",
    maxPrice: "",
    productType: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleApplyFilters = () => {
    // Pass the filters to the parent component
    onApplyFilters(filters);
  };

  return (
    <div className="filterContainer">
      <div className="filter">
        <div className="filterItem">
          <label htmlFor="productName">Product Name: </label>
          <input
            type="text"
            name="productName"
            placeholder="Enter product name"
            value={filters.productName}
            onChange={handleInputChange}
          />

          <label htmlFor="minPrice">Min Price: </label>
          <input
            type="number"
            name="minPrice"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={handleInputChange}
          />

          <label htmlFor="maxPrice">Max Price: </label>
          <input
            type="number"
            name="maxPrice"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={handleInputChange}
          />

          <label htmlFor="productType">Product Type: </label>
          <select
            name="productType"
            value={filters.productType}
            onChange={handleInputChange}
          >
            <option value="">All Types</option>
            <option value="phone">phone</option>
            <option value="clothe">clothe</option>
            <option value="robot">robot</option>
            <option value="device">device</option>
          </select>

          <button onClick={handleApplyFilters} className="applyBtn">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
