const Product = require("../model/Product");

const {
  parseCatalogBody,
  applyUploadedImage,
  removeOldImage,
  formatCatalogItem,
} = require("../utils/catalogUpload.utils");

const Category = require("../model/Category.model"); // ← محتاجينها للفلتر بالـ slug


// ======================
// GET ALL PRODUCTS
// ======================
exports.getProducts = async (req, res) => {
  try {
    const filter = {}; // فلتر فاضي = رجّع كل المنتجات
    // لو المستخدم بعت ?category=wood في الـ URL
    if (req.query.category) {
      // نلاقي الـ category بالـ slug بتاعها في الأول
      const category = await Category.findOne({ slug: req.query.category });
      // لو لقيناها، نضيف الـ _id بتاعها للفلتر
      if (category) {
        filter.category = category._id;
      }
    }
    // Product.find(filter) → لو filter فاضي يرجع كل حاجة، لو فيه category يفلتر
    const products = await Product.find(filter).populate("category");

    res.status(200).json({
      success: true,
      count: products.length,
      data: products.map(formatCatalogItem),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET PRODUCT BY ID
// ======================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: formatCatalogItem(product),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// CREATE PRODUCT
// ======================
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await product.populate("category"); // ← populate بعد الإنشاء عشان يظهر اسم الـ category مش بس الـ ID

    res.status(201).json({
      success: true,
      data: formatCatalogItem(product),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// UPDATE PRODUCT
// ======================
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const body = parseCatalogBody(req.body);
    applyUploadedImage(body, req.file, "products");

    if (req.file && product.image) {
      removeOldImage(product.image);
    }

    Object.assign(product, body);
    await product.save();

    res.status(200).json({
      success: true,
      data: formatCatalogItem(product),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// DELETE PRODUCT
// ======================
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.image) {
      removeOldImage(product.image);
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// ADD REVIEW
// ======================
exports.addReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const newReview = {
      author: req.body.author,
      comment: req.body.comment,
      date: new Date(),
    };

    product.reviews.push(newReview);
    product.reviewCount = product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      data: formatCatalogItem(product),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = product.reviews.id(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.author = req.body.author ?? review.author;
    review.comment = req.body.comment ?? review.comment;
    review.date = new Date();

    await product.save();

    res.status(200).json({
      success: true,
      data: formatCatalogItem(product),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// DELETE REVIEW
// ======================
exports.deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.reviews = product.reviews.filter(
      (r) => (r._id || r.id).toString() !== reviewId
    );

    product.reviewCount = product.reviews.length;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: formatCatalogItem(product),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
