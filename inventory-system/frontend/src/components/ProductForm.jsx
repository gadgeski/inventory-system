import React, { useState, useEffect } from "react";

export default function ProductForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    unit: "",
    reorder_point: 0,
    stock_quantity: 0,
  });

  useEffect(() => {
    if (initial)
      setForm({
        sku: initial.sku || "",
        name: initial.name || "",
        description: initial.description || "",
        unit: initial.unit || "",
        reorder_point: initial.reorder_point ?? 0,
        stock_quantity: initial.stock_quantity ?? 0,
      });
  }, [initial]);

  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      reorder_point: Number(form.reorder_point),
      stock_quantity: Number(form.stock_quantity),
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
      <input
        placeholder="SKU"
        value={form.sku}
        onChange={(e) => set("sku", e.target.value)}
        required
      />
      <input
        placeholder="商品名"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        required
      />
      <input
        placeholder="単位（pcs, kgなど）"
        value={form.unit}
        onChange={(e) => set("unit", e.target.value)}
      />
      <textarea
        placeholder="説明"
        value={form.description}
        onChange={(e) => set("description", e.target.value)}
      />
      <input
        type="number"
        placeholder="発注点"
        value={form.reorder_point}
        onChange={(e) => set("reorder_point", e.target.value)}
      />
      <input
        type="number"
        placeholder="初期在庫"
        value={form.stock_quantity}
        onChange={(e) => set("stock_quantity", e.target.value)}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">保存</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
