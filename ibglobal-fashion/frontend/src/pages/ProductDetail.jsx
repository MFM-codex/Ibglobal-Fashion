import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { useCart } from "../context/CartContext.jsx";
import StarRating from "../components/StarRating.jsx";

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [reviewStatus, setReviewStatus] = useState("");

  useEffect(() => {
    api
      .getProduct(id)
      .then((data) => {
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0].size);
      })
      .catch(() => setProduct(null));
  }, [id]);

  if (!product) {
    return <div className="max-w-6xl mx-auto px-5 py-16 text-charcoal/60">Loading…</div>;
  }

  function handleAddToCart() {
    if (product.sizes.length && !selectedSize) {
      setError("Please choose a size.");
      return;
    }
    setError("");
    addItem(product, selectedSize || null, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setReviewStatus("");
    try {
      await api.addReview(product.id, reviewForm);
      setReviewStatus("Thank you — your review has been posted.");
      setReviewForm({ name: "", rating: 5, comment: "" });
      const refreshed = await api.getProduct(id);
      setProduct(refreshed);
    } catch (err) {
      setReviewStatus(err.message);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-[3/4] bg-parchmentDark border border-ink/10 overflow-hidden">
            {product.images?.length ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink/30 font-display">
                No photo yet
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-20 border ${i === activeImage ? "border-brass" : "border-ink/10"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-wide2 text-brass mb-2">{product.category}</p>
          <h1 className="font-display text-3xl text-ink">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            {product.avgRating ? (
              <>
                <StarRating value={product.avgRating} />
                <span className="text-sm text-charcoal/60">
                  {product.avgRating} ({product.reviews.length} review{product.reviews.length !== 1 ? "s" : ""})
                </span>
              </>
            ) : (
              <span className="text-sm text-charcoal/50">No reviews yet</span>
            )}
          </div>
          <p className="text-2xl text-ink mt-4 font-display">{formatNaira(product.price)}</p>
          <p className="mt-4 text-charcoal/80 leading-relaxed">{product.description}</p>

          {/* Size chart */}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-ink mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    className={`px-4 py-2 text-sm border ${
                      selectedSize === s.size ? "border-brass bg-brass/10 text-ink" : "border-ink/20 text-charcoal/70"
                    } ${s.stock === 0 ? "opacity-30 cursor-not-allowed" : "hover:border-brass"}`}
                  >
                    {s.size}
                    {s.stock === 0 && " — sold out"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + add to cart */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-ink/20">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2" aria-label="Decrease quantity">
                −
              </button>
              <span className="px-4 text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2" aria-label="Increase quantity">
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-ink text-parchment py-3 text-sm font-medium hover:bg-inkLight transition"
            >
              {added ? "Added to cart" : "Add to cart"}
            </button>
          </div>
          {error && <p className="text-wine text-sm mt-2">{error}</p>}

          {product.madeToOrder && (
            <div className="mt-4 border border-brass/40 bg-brass/5 px-4 py-3">
              <p className="text-sm text-ink">
                Want this made to your own measurements?{" "}
                <Link to={`/custom-order?productId=${product.id}`} className="text-brass underline">
                  Start a custom order
                </Link>
              </p>
            </div>
          )}

          {/* Fabric / quality / care */}
          <div className="mt-8 divide-y divide-ink/10 border-t border-b border-ink/10">
            <DetailRow label="Fabric" value={product.fabric} />
            <DetailRow label="Quality" value={product.quality} />
            <DetailRow label="Care" value={product.care} />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16 max-w-2xl">
        <h2 className="font-display text-2xl text-ink mb-4">Reviews</h2>
        <div className="tape-rule w-20 mb-6" />

        {product.reviews.length === 0 && (
          <p className="text-charcoal/60 text-sm mb-6">No reviews yet. Be the first to share your fit.</p>
        )}

        <ul className="space-y-4 mb-8">
          {product.reviews.map((r) => (
            <li key={r.id} className="border border-ink/10 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink text-sm">{r.name}</span>
                <StarRating value={r.rating} size={14} />
              </div>
              {r.comment && <p className="text-sm text-charcoal/70 mt-2">{r.comment}</p>}
            </li>
          ))}
        </ul>

        <form onSubmit={handleReviewSubmit} className="border border-ink/10 p-5 space-y-3">
          <p className="font-display text-base text-ink">Leave a review</p>
          <input
            type="text"
            placeholder="Your name"
            required
            value={reviewForm.name}
            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
            className="w-full border border-ink/20 px-3 py-2 text-sm"
          />
          <select
            value={reviewForm.rating}
            onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
            className="w-full border border-ink/20 px-3 py-2 text-sm"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <textarea
            placeholder="How did it fit? (optional)"
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            className="w-full border border-ink/20 px-3 py-2 text-sm"
            rows={3}
          />
          <button type="submit" className="bg-ink text-parchment px-5 py-2 text-sm hover:bg-inkLight transition">
            Post review
          </button>
          {reviewStatus && <p className="text-sm text-charcoal/70">{reviewStatus}</p>}
        </form>
      </section>
    </div>
  );
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="py-3 flex gap-4">
      <span className="w-24 shrink-0 text-sm text-charcoal/50">{label}</span>
      <span className="text-sm text-charcoal/80">{value}</span>
    </div>
  );
}
