import React from "react";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../../Context/FavouritesContext";
import { useCart } from "../../Context/CartContext";
import Rating from "../../components/Rating";
import Navbar from "../../components/Navbar";
import "./Favourites.css";

const Favourites: React.FC = () => {
  const navigate = useNavigate();
  const {
    favourites,
    materialFavourites,
    removeFromFavourites,
    removeMaterialFavourite,
    clearFavourites,
  } = useFavourites();
  const { addToCart, addMaterialToCart } = useCart();

  const totalCount = favourites.length + materialFavourites.length;

  return (
    <div className="favourites-page">
      <Navbar />

      <div className="favourites-container">
        <div className="favourites-header">
          <h1 className="favourites-title">My Wishlist</h1>
          <p className="favourites-subtitle">
            Items you&apos;ve saved for later · {totalCount} items
          </p>
          <div className="favourites-actions">
            <button className="clear-all-btn" onClick={clearFavourites}>
              <i className="bi bi-trash" /> Clear All
            </button>
          </div>
        </div>

        {totalCount === 0 ? (
          <div className="empty-favourites">
            <i className="bi bi-heart" />
            <h2>Your wishlist is empty</h2>
            <p>Save your favourite products and materials here!</p>
            <div className="empty-favourites-buttons">
              <button className="continue-btn" onClick={() => navigate("/products")}>
                Shop Products
              </button>
              <button className="continue-btn materials" onClick={() => navigate("/materials")}>
                Shop Materials
              </button>
            </div>
          </div>
        ) : (
          <>
            {favourites.length > 0 && (
              <section className="favourites-section">
                <h2 className="favourites-section-title">Products</h2>
                <div className="favourites-grid">
                  {favourites.map((product) => (
                    <div key={product.id} className="favourites-item">
                      <div
                        className="favourites-item-image"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.image ? (
                          <img src={product.image} alt={product.name} />
                        ) : (
                          <span className="product-emoji">🏺</span>
                        )}
                      </div>
                      <div className="favourites-item-details">
                        <div className="product-info" onClick={() => navigate(`/product/${product.id}`)}>
                          <h3 className="product-name">{product.name}</h3>
                          <p className="product-artist">by {product.artist}</p>
                          <Rating rating={product.rating} reviewCount={product.reviewCount} />
                          <div className="product-price">
                            <span className="current-price">{product.price} {product.currency}</span>
                          </div>
                        </div>
                        <div className="item-actions">
                          <button className="add-to-cart-btn" onClick={() => addToCart(product, 1)}>
                            Add to Cart
                          </button>
                          <button
                            className="move-to-cart-btn"
                            onClick={() => removeFromFavourites(product.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {materialFavourites.length > 0 && (
              <section className="favourites-section">
                <h2 className="favourites-section-title">Materials</h2>
                <div className="favourites-grid">
                  {materialFavourites.map((material) => (
                    <div key={material.id} className="favourites-item">
                      <div
                        className="favourites-item-image"
                        onClick={() => navigate(`/materials/${material.id}`)}
                      >
                        {material.image ? (
                          <img src={material.image} alt={material.name} />
                        ) : (
                          <span className="product-emoji">🧵</span>
                        )}
                      </div>
                      <div className="favourites-item-details">
                        <div className="product-info" onClick={() => navigate(`/materials/${material.id}`)}>
                          <h3 className="product-name">{material.name}</h3>
                          <p className="product-artist">{material.category}</p>
                          <Rating rating={material.rating} reviewCount={material.reviewCount} />
                          <div className="product-price">
                            <span className="current-price">{material.price} EGP</span>
                          </div>
                        </div>
                        <div className="item-actions">
                          <button
                            className="add-to-cart-btn"
                            onClick={() => addMaterialToCart(material, 1)}
                          >
                            Add to Cart
                          </button>
                          <button
                            className="move-to-cart-btn"
                            onClick={() => removeMaterialFavourite(material.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Favourites;
