import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { api } from "../../api";

const emptyProduct = {
  name: "",
  category: "",
  price: "",
  images: [],
  sizes: [{ size: "", stock: 0 }],
  fabric: "",
  quality: "",
  care: "",
  madeToOrder: false,
  inStock: true,
  description: "",
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = id && id !== "new";
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.getProduct(id).then((data) =>
        setForm({
          ...data,
          sizes: data.sizes.length ? data.sizes : [{ size: "", stock: 0 }],
        })
      );
    }
  }, [id, isEditing]);

  function updateSize(index, field, value) {
    const sizes = [...form.sizes];
    sizes[index] = { ...sizes[index], [field]: field === "stock" ? Number(value) : value };
    setForm({ ...form, sizes });
  }

  function addSizeRow() {
    setForm({ ...form, sizes: [...form.sizes, { size: "", stock: 0 }] });
  }

  function removeSizeRow(index) {
    setForm({ ...form, sizes: form.sizes.filter((_, i) => i !== index) });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await api.uploadImage(file, token);
      setForm((f) => ({ ...f, images: [...f.images, url] }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url) {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        sizes: form.sizes.filter((s) => s.size.trim() !== ""),
      };
      if (isEditing) {
        await api.updateProduct(id, payload, token);
      } else {
        await api.createProduct(payload, token);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl text-ink mb-6">
        {isEditing ? "Edit product" : "Add product"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Product name">
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-ink/20 px-3 py-2 text-sm bg-white"
            />
          </Field>
          <Field label="Category">
            <input
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Native Wear, Suits, Casual Wear, Kids"
              className="w-full border border-ink/20 px-3 py-2 text-sm bg-white"
            />
          </Field>
        </div>

        <Field label="Price (₦)">
          <input
            required
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border border-ink/20 px-3 py-2 text-sm bg-white sm:w-48"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-ink/20 px-3 py-2 text-sm bg-white"
            rows={3}
          />
        </Field>

        {/* Photos */}
        <div>
          <p className="text-sm font-medium text-ink mb-2">Photos</p>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images.map((url) => (
              <div key={url} className="relative w-20 h-24 border border-ink/10">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="absolute -top-2 -right-2 bg-wine text-white w-5 h-5 rounded-full text-xs"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <label className="inline-block text-sm border border-ink/20 px-4 py-2 cursor-pointer hover:border-brass">
            {uploading ? "Uploading…" : "Upload photo"}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* Size chart — this is the "insert sizes, quality, fabric" panel */}
        <div>
          <p className="text-sm font-medium text-ink mb-2">Size chart &amp; stock</p>
          <div className="space-y-2">
            {form.sizes.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  placeholder="Size (e.g. M, 40, 6-7Y)"
                  value={s.size}
                  onChange={(e) => updateSize(i, "size", e.target.value)}
                  className="border border-ink/20 px-3 py-2 text-sm bg-white flex-1"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Stock"
                  value={s.stock}
                  onChange={(e) => updateSize(i, "stock", e.target.value)}
                  className="border border-ink/20 px-3 py-2 text-sm bg-white w-24"
                />
                <button
                  type="button"
                  onClick={() => removeSizeRow(i)}
                  className="text-wine text-sm px-2"
                  aria-label="Remove size"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addSizeRow} className="text-brass text-sm mt-2 hover:underline">
            + Add another size
          </button>
        </div>

        {/* Fabric / quality / care — this is the garment-detail panel */}
        <Field label="Fabric / material">
          <input
            value={form.fabric}
            onChange={(e) => setForm({ ...form, fabric: e.target.value })}
            placeholder="e.g. Hand-woven Aso-Oke with silk lining"
            className="w-full border border-ink/20 px-3 py-2 text-sm bg-white"
          />
        </Field>
        <Field label="Garment quality / grade">
          <input
            value={form.quality}
            onChange={(e) => setForm({ ...form, quality: e.target.value })}
            placeholder="e.g. Premium — hand-finished seams, double-stitched hems"
            className="w-full border border-ink/20 px-3 py-2 text-sm bg-white"
          />
        </Field>
        <Field label="Care instructions">
          <input
            value={form.care}
            onChange={(e) => setForm({ ...form, care: e.target.value })}
            placeholder="e.g. Dry clean only"
            className="w-full border border-ink/20 px-3 py-2 text-sm bg-white"
          />
        </Field>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.madeToOrder}
              onChange={(e) => setForm({ ...form, madeToOrder: e.target.checked })}
            />
            Available as made-to-order
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
            />
            In stock
          </label>
        </div>

        {error && <p className="text-wine text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-ink text-parchment px-6 py-2.5 text-sm font-medium hover:bg-inkLight transition disabled:opacity-50"
          >
            {saving ? "Saving…" : isEditing ? "Save changes" : "Add product"}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink block mb-1">{label}</span>
      {children}
    </label>
  );
}
