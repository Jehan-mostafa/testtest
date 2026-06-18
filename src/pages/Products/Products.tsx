import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Rating from "../../components/Rating";
import Navbar from "../../components/Navbar";
import { useFavourites } from "../../Context/FavouritesContext";
import { useCart } from "../../Context/CartContext";
import { getProducts } from "../../api/productService.js";
import type { Product } from "../../types/product";
import "../styles/global.css";
import "./Products.css";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedToCartId, setAddedToCartId] = useState<number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = useMemo(
    () => [...new Set(products.map((p) => p.category))],
    [products],
  );

  const materials = useMemo(
    () => [...new Set(products.map((p) => p.material).filter(Boolean))] as string[],
    [products],
  );

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedMaterial && p.material !== selectedMaterial) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (p.rating < minRating) return false;
      return true;
    });
  }, [products, selectedCategory, selectedMaterial, priceRange, minRating, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedMaterial("");
    setPriceRange([0, 2000]);
    setMinRating(0);
    setSearchQuery("");
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToCartId(product.id);
    setTimeout(() => setAddedToCartId(null), 2000);
  };

  const handleImageError = (productId: string | number) => {
    setBrokenImages((current) => ({
      ...current,
      [String(productId)]: true,
    }));
  };

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const products = await getProducts();
      setProducts(products);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError("");

      try {
        const products = await getProducts();
        if (!active) return;
        setProducts(products);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="products-page">
      <Navbar />

      <div className="products-main">
        <div className="catalog-page-hero products">
          <h1>Handmade Products</h1>
          <p>Unique crafts from talented artists</p>
        </div>

        {loading && (
          <div className="products-loading">
            <p>Loading products...</p>
          </div>
        )}

        {error && (
          <div className="products-error alert alert-danger">
            <p>{error}</p>
            <button className="btn btn-outline" onClick={loadProducts}>
              Retry
            </button>
          </div>
        )}
        <button 
          className="search-toggle-btn btn btn-outline d-md-none"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
        >
          {isSearchOpen ? (
            <>
              <i className="bi bi-x-lg"></i> Close
            </>
          ) : (
            <>
              <i className="bi bi-search"></i> Search
            </>
          )}
        </button>

        <div className={`search-bar-wrapper ${isSearchOpen ? "open" : ""}`}>
          <div className="search-input-container">
            <span className="search-icon"> <i className="bi bi-search"></i></span>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, artist, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {searchQuery && (
          <div className="search-results-info">
            <p>
              <i className="bi bi-search"></i> Found <strong>{filteredProducts.length}</strong> result{filteredProducts.length !== 1 && "s"} for "<strong>{searchQuery}</strong>"
              <button className="search-clear-link" onClick={() => setSearchQuery("")}>Clear search</button>
            </p>
          </div>
        )}

        <div className="products-layout">
          <aside className="products-filters">
            <div className="filters-card">
              <div className="filter-header">
                <i className="bi bi-sliders2"></i>
                <h5>Filters</h5>
              </div>

              <div className="filter-group">
                <strong>Categories</strong>
                <div className="filter-buttons">
                  <button
                    className={`filter-chip ${selectedCategory === "" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("")}
                  >
                    All
                  </button>
                  {categories.map(cat => (
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
                <strong>Materials</strong>
                <div className="filter-buttons">
                  <button
                    className={`filter-chip ${selectedMaterial === "" ? "active" : ""}`}
                    onClick={() => setSelectedMaterial("")}
                  >
                    All
                  </button>
                  {materials.map(mat => (
                    <button
                      key={mat}
                      className={`filter-chip ${selectedMaterial === mat ? "active" : ""}`}
                      onClick={() => setSelectedMaterial(mat)}
                    >
                      {mat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <strong>Price Range (EGP)</strong>
                <div className="price-range-container">
                  <div className="price-values">
                    <span className="price-min-value">{priceRange[0]} EGP</span>
                    <span className="price-separator">—</span>
                    <span className="price-max-value">{priceRange[1]}+ EGP</span>
                  </div>
                  <input
                    type="range"
                    className="price-range-slider"
                    min={0}
                    max={2000}
                    step={10}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                  />
                  <div className="price-track-labels">
                    <span>0</span>
                    <span>500</span>
                    <span>1000</span>
                    <span>1500</span>
                    <span>2000+</span>
                  </div>
                </div>
              </div>

              <div className="filter-group">
                <strong>Min Rating</strong>
                <div className="rating-select-container">
                  <select
                    className="rating-select"
                    value={minRating}
                    onChange={(e) => setMinRating(+e.target.value)}
                  >
                    <option value={0}>Any rating</option>
                    <option value={4}>★★★★ & up (4+)</option>
                    <option value={3}>★★★ & up (3+)</option>
                    <option value={2}>★★ & up (2+)</option>
                  </select>
                </div>
              </div>

              <button className="clear-filters-btn" onClick={clearFilters}>
                <i className="bi bi-x-circle"></i>
                Clear All Filters
              </button>
            </div>
          </aside>

          <div className="products-grid-container">
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products match your search or filters.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear All</button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="market-product-card"
                  >
                    <div 
                      className="market-product-thumb"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.image && !brokenImages[String(product.id)] ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="market-product-image"
                          onError={() => handleImageError(product.id)}
                        />
                      ) : (
                        <span className="market-product-emoji">🏺</span>
                      )}
                      <button
                        className={`market-favourite-btn ${isFavourite(product.id) ? "active" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavourite(product);
                        }}
                      >
                        <i className={`bi ${isFavourite(product.id) ? "bi-heart-fill" : "bi-heart"}`}></i>
                      </button>
                    </div>
                    <div className="market-product-info">
                      <div className="market-product-top">
                        <h5 className="market-product-name">{product.name}</h5>
                        <p className="market-product-price">{product.price} {product.currency}</p>
                      </div>
                      <p className="market-product-seller">By {product.artist}</p>
                   
                      <button
                        className={`btn btn-primary market-product-btn ${addedToCartId === product.id ? "added" : ""}`}
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <i className="bi bi-cart-plus"></i> 
                        {addedToCartId === product.id ? " Added!" : " Add to Cart"}
                      </button>
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

export default Products;