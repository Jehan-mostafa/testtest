// routes/productRoutes.js

const express = require("express");
const router = express.Router();
const { productUpload } = require("../config/catalogUpload.config");

const {
  getProducts,
  getProductById,
  createProduct,
  getGiftRecommendations,
  updateProduct,
  deleteProduct,
  addReview,
  updateReview,
  deleteReview,
} = require("../controller/productController");

router.get("/", getProducts);
router.post("/recommendations", getGiftRecommendations);
router.get("/:id", getProductById);
router.post("/", productUpload.single("image"), createProduct);
router.put("/:id", productUpload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/reviews", addReview);
router.put("/:productId/reviews/:reviewId", updateReview);
router.delete("/:productId/reviews/:reviewId", deleteReview);

module.exports = router;
