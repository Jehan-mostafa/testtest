import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useCart } from "../../Context/CartContext";
import { getGiftRecommendations } from "../../api/productService.js";
import type { Product } from "../../types/product";
import "../styles/global.css";
import "./GiftQuiz.css";

type QuizStep = "occasion" | "gender" | "age" | "budget";

type QuizState = {
  occasion: string;
  gender: string;
  age: string;
  budget: string;
};

const STEPS: { key: QuizStep; label: string }[] = [
  { key: "occasion", label: "Occasion" },
  { key: "gender", label: "Recipient" },
  { key: "age", label: "Age" },
  { key: "budget", label: "Budget" },
];

const OPTIONS: Record<Exclude<QuizStep, "budget">, { label: string; value: string; hint: string }[]> = {
  occasion: [
    { label: "Birthday", value: "birthday", hint: "Warm, personal picks" },
    { label: "Wedding", value: "wedding", hint: "Elegant shared-home pieces" },
    { label: "Anniversary", value: "anniversary", hint: "Meaningful keepsakes" },
    { label: "Graduation", value: "graduation", hint: "Fresh-start gifts" },
  ],
  gender: [
    { label: "Male", value: "male", hint: "Crafted everyday choices" },
    { label: "Female", value: "female", hint: "Jewelry, decor, and more" },
  ],
  age: [
    { label: "Child", value: "child", hint: "Simple and playful" },
    { label: "Teen", value: "teen", hint: "Expressive and personal" },
    { label: "Adult", value: "adult", hint: "Refined handmade finds" },
  ],
};

const INITIAL_STATE: QuizState = {
  occasion: "",
  gender: "",
  age: "",
  budget: "",
};

export default function GiftQuiz() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [answers, setAnswers] = useState<QuizState>(INITIAL_STATE);
  const [results, setResults] = useState<Product[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addedToCartId, setAddedToCartId] = useState<string | number | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const completedCount = useMemo(
    () => Object.values(answers).filter((value) => String(value).trim()).length,
    [answers],
  );

  const canSubmit = Boolean(answers.occasion && answers.gender && answers.age && answers.budget);

  const selectAnswer = (key: keyof QuizState, value: string) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || loading) return;

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const products = await getGiftRecommendations({
        occasion: answers.occasion,
        gender: answers.gender,
        age: answers.age,
        budget: Number(answers.budget),
      });
      setResults(products);
    } catch (err) {
      setResults([]);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setAnswers(INITIAL_STATE);
    setResults([]);
    setHasSearched(false);
    setError("");
  };

  const handleAddToCart = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation();
    addToCart(product, 1);
    setAddedToCartId(product.id);
    setTimeout(() => setAddedToCartId(null), 1800);
  };

  const handleImageError = (productId: string | number) => {
    setBrokenImages((current) => ({ ...current, [String(productId)]: true }));
  };

  return (
    <div className="gift-quiz-page page-wrapper">
      <Navbar />

      <main>
        <section className="gift-quiz-hero">
          <div className="container gift-quiz-hero-inner">
            <div>
              <span className="section-label">Gift Quiz</span>
              <h1 className="display-xl gift-quiz-title">Find the right handmade gift.</h1>
              <p className="lead gift-quiz-desc">
                Answer a few quick questions and we will match products by occasion, recipient,
                age group, and budget.
              </p>
            </div>
            <div className="gift-quiz-progress" aria-label="Quiz progress">
              <strong data-i18n-managed="true">{completedCount}/4</strong>
              <span>Answered</span>
            </div>
          </div>
        </section>

        <section className="gift-quiz-workspace">
          <div className="container gift-quiz-layout">
            <form className="gift-quiz-panel" onSubmit={handleSubmit}>
              <div className="gift-quiz-steps">
                {STEPS.map((step, index) => {
                  const active = Boolean(answers[step.key]);
                  return (
                    <div key={step.key} className={`gift-step ${active ? "complete" : ""}`}>
                      <span>{index + 1}</span>
                      <p>{step.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="gift-question">
                <div className="gift-question-head">
                  <span className="section-label">Step 1</span>
                  <h2>What is the occasion?</h2>
                </div>
                <div className="gift-option-grid">
                  {OPTIONS.occasion.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`gift-option ${answers.occasion === option.value ? "selected" : ""}`}
                      onClick={() => selectAnswer("occasion", option.value)}
                    >
                      <strong>{option.label}</strong>
                      <span>{option.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="gift-question">
                <div className="gift-question-head">
                  <span className="section-label">Step 2</span>
                  <h2>Who is it for?</h2>
                </div>
                <div className="gift-option-grid two">
                  {OPTIONS.gender.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`gift-option ${answers.gender === option.value ? "selected" : ""}`}
                      onClick={() => selectAnswer("gender", option.value)}
                    >
                      <strong>{option.label}</strong>
                      <span>{option.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="gift-question">
                <div className="gift-question-head">
                  <span className="section-label">Step 3</span>
                  <h2>Choose an age group.</h2>
                </div>
                <div className="gift-option-grid three">
                  {OPTIONS.age.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`gift-option ${answers.age === option.value ? "selected" : ""}`}
                      onClick={() => selectAnswer("age", option.value)}
                    >
                      <strong>{option.label}</strong>
                      <span>{option.hint}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="gift-question">
                <div className="gift-question-head">
                  <span className="section-label">Step 4</span>
                  <h2>Set your budget.</h2>
                </div>
                <label className="gift-budget-field">
                  <span>Maximum price</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="500"
                    value={answers.budget}
                    onChange={(event) => selectAnswer("budget", event.target.value)}
                  />
                  <small>EGP</small>
                </label>
              </div>

              <div className="gift-actions">
                <button className="btn btn-primary" type="submit" disabled={!canSubmit || loading}>
                  {loading ? "Finding gifts..." : "Find Gifts"}
                </button>
                <button className="btn btn-ghost" type="button" onClick={resetQuiz}>
                  Reset
                </button>
              </div>
            </form>

            <aside className="gift-results-panel">
              <div className="gift-results-head">
                <span className="section-label">Recommendations</span>
                <h2>Matched gifts</h2>
              </div>

              {error && (
                <div className="gift-state error">
                  <p>{error}</p>
                  <button className="btn btn-outline" onClick={handleSubmit}>
                    Retry
                  </button>
                </div>
              )}

              {!error && loading && (
                <div className="gift-state">
                  <p>Searching handmade products...</p>
                </div>
              )}

              {!error && !loading && !hasSearched && (
                <div className="gift-state">
                  <p>Your recommendations will appear here after you complete the quiz.</p>
                </div>
              )}

              {!error && !loading && hasSearched && results.length === 0 && (
                <div className="gift-state">
                  <p>No matching gifts found.</p>
                  <button className="btn btn-outline" onClick={resetQuiz}>
                    Change Answers
                  </button>
                </div>
              )}

              {!error && !loading && results.length > 0 && (
                <div className="gift-results-grid">
                  {results.map((product) => (
                    <article key={product.id} className="gift-product-card">
                      <button
                        className="gift-product-thumb"
                        type="button"
                        onClick={() => navigate(`/product/${product.id}`)}
                        aria-label={`View ${product.name}`}
                      >
                        {product.image && !brokenImages[String(product.id)] ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={() => handleImageError(product.id)}
                          />
                        ) : (
                          <span>Gift</span>
                        )}
                      </button>
                      <div className="gift-product-info">
                        <div>
                          <h3>{product.name}</h3>
                          <p>By {product.artist}</p>
                        </div>
                        <strong>
                          {product.price} {product.currency || "EGP"}
                        </strong>
                        <div className="gift-product-actions">
                          <button
                            className="btn btn-outline"
                            type="button"
                            onClick={() => navigate(`/product/${product.id}`)}
                          >
                            View Details
                          </button>
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={(event) => handleAddToCart(product, event)}
                          >
                            {addedToCartId === product.id ? "Added" : "Add to Cart"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
