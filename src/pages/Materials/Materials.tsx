import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Rating from "../../components/Rating";
import Navbar from "../../components/Navbar";
import { useFavourites } from "../../Context/FavouritesContext";
import { useCart } from "../../Context/CartContext";
import { getMaterials } from "../../api/materialService.js";
import type { Material } from "../../types/material";
import "../styles/global.css";
import "../Products/Products.css";
import "./Materials.css";

const Materials: React.FC = () => {
  const navigate = useNavigate();
  const { addMaterialToCart } = useCart();
  const { isMaterialFavourite, toggleMaterialFavourite } = useFavourites();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedId, setAddedId] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = useMemo(
    () => [...new Set(materials.map((m) => m.category))],
    [materials]
  );

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (selectedCategory && m.category !== selectedCategory) return false;
      if (m.price < priceRange[0] || m.price > priceRange[1]) return false;
      if (m.rating < minRating) return false;
      return true;
    });
  }, [materials, selectedCategory, priceRange, minRating, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange([0, 500]);
    setMinRating(0);
    setSearchQuery("");
  };

  const loadMaterials = async () => {
    setLoading(true);
    setError("");
    try {
      setMaterials(await getMaterials());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  return (
    <div className="products-page materials-page">
      <Navbar />

      <div className="products-main materials-main">
        <div className="catalog-page-hero materials">
          <h1>Craft Materials</h1>
          <p>Quality supplies for your handmade projects</p>
        </div>

        {loading && (
          <div className="products-loading">
            <p>Loading materials...</p>
          </div>
        )}

        {error && (
          <div className="products-error alert alert-danger">
            <p>{error}</p>
            <button className="btn btn-outline" onClick={loadMaterials}>Retry</button>
          </div>
        )}

        <div className="search-input-container">
          <span className="search-icon"><i className="bi bi-search" /></span>
          <input
            type="text"
            className="search-input"
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="products-layout">
          <aside className="products-filters">
            <div className="filters-card">
              <div className="filter-header">
                <i className="bi bi-sliders2" />
                <h5>Filters</h5>
              </div>

              <div className="filter-group">
                <strong>Category</strong>
                <div className="filter-buttons">
                  <button
                    className={`filter-chip ${selectedCategory === "" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("")}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <strong>Price Range (EGP)</strong>
                <input
                  type="range"
                  className="price-range-slider"
                  min={0}
                  max={500}
                  step={5}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, +e.target.value])}
                />
                <span>Up to {priceRange[1]} EGP</span>
              </div>

              <div className="filter-group">
                <strong>Min Rating</strong>
                <select
                  className="rating-select"
                  value={minRating}
                  onChange={(e) => setMinRating(+e.target.value)}
                >
                  <option value={0}>Any rating</option>
                  <option value={4}>4+ stars</option>
                  <option value={3}>3+ stars</option>
                </select>
              </div>

              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </aside>

          <div className="products-grid-container">
            {filtered.length === 0 && !loading ? (
              <div className="no-products">
                <p>No materials found.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map((material) => (
                  <div key={material.id} className="market-product-card">
                    <div
                      className="market-product-thumb"
                      onClick={() => navigate(`/materials/${material.id}`)}
                    >
                      {material.image && !brokenImages[material.id] ? (
                        <img
                          src={material.image}
                          alt={material.name}
                          className="market-product-image"
                          onError={() =>
                            setBrokenImages((c) => ({ ...c, [material.id]: true }))
                          }
                        />
                      ) : (
                        <span className="market-product-emoji">🧵</span>
                      )}
                      <button
                        className={`market-favourite-btn ${isMaterialFavourite(material.id) ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMaterialFavourite(material);
                        }}
                        aria-label={`Favourite ${material.name}`}
                      >
                        <i className={`bi ${isMaterialFavourite(material.id) ? "bi-heart-fill" : "bi-heart"}`} />
                      </button>
                    </div>

                    <div className="market-product-info">
                      <div className="market-product-top">
                        <h5 className="market-product-name">{material.name}</h5>
                        <p className="market-product-price">{material.price} EGP</p>
                      </div>
                      <p className="market-product-seller">{material.category}</p>
                      <p className="material-stock-label">
                        {material.stock > 0 ? `${material.stock} in stock` : "Out of stock"}
                      </p>
                     
                      <p className="material-short-desc">
                        {material.description.slice(0, 60)}
                        {material.description.length > 60 ? "..." : ""}
                      </p>

                      <div className="material-card-actions">
                        <button
                          className={`btn btn-primary market-product-btn ${addedId === material.id ? "added" : ""}`}
                          disabled={material.stock === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            addMaterialToCart(material, 1);
                            setAddedId(material.id);
                            setTimeout(() => setAddedId(null), 2000);
                          }}
                        >
                          <i className="bi bi-cart-plus" />
                          {addedId === material.id ? " Added!" : " Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materials;
