import React from "react";
import "./Filters.css";

interface FiltersProps {
  categories: string[];
  materials: string[];
  selectedCategory: string;
  selectedMaterial: string;
  priceRange: [number, number];
  minRating: number;
  onCategoryChange: (cat: string) => void;
  onMaterialChange: (mat: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onRatingChange: (rating: number) => void;
  onClear: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  categories,
  materials,
  selectedCategory,
  selectedMaterial,
  priceRange,
  minRating,
  onCategoryChange,
  onMaterialChange,
  onPriceChange,
  onRatingChange,
  onClear,
}) => {
  return (
    <div className="filters-card p-3 mb-4">
      <h5>Filters</h5>
      
      <div className="mb-3">
        <strong>Categories</strong>
        <div className="mt-2">
          <button className={`filter-btn ${selectedCategory === "" ? "active" : ""}`} onClick={() => onCategoryChange("")}>All</button>
          {categories.map(cat => (
            <button key={cat} className={`filter-btn ${selectedCategory === cat ? "active" : ""}`} onClick={() => onCategoryChange(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <strong>Materials</strong>
        <div className="mt-2">
          <button className={`filter-btn ${selectedMaterial === "" ? "active" : ""}`} onClick={() => onMaterialChange("")}>All</button>
          {materials.map(mat => (
            <button key={mat} className={`filter-btn ${selectedMaterial === mat ? "active" : ""}`} onClick={() => onMaterialChange(mat)}>{mat}</button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <strong>Price Range</strong>
        <div className="d-flex gap-2 mt-2">
          <input type="number" className="form-control" placeholder="Min" value={priceRange[0]} onChange={(e) => onPriceChange([+e.target.value, priceRange[1]])} />
          <input type="number" className="form-control" placeholder="Max" value={priceRange[1]} onChange={(e) => onPriceChange([priceRange[0], +e.target.value])} />
        </div>
      </div>

      <div className="mb-3">
        <strong>Min Rating</strong>
        <select className="form-select mt-2" value={minRating} onChange={(e) => onRatingChange(+e.target.value)}>
          <option value={0}>Any rating</option>
          <option value={4}>★★★★ & up</option>
          <option value={3}>★★★ & up</option>
        </select>
      </div>

      <button className="btn btn-sm btn-secondary w-100" onClick={onClear}>Clear All Filters</button>
    </div>
  );
};

export default Filters;