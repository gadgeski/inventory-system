import React, { useState } from "react";

export default function TransactionForm({ products, onSubmit }) {
  const [form, setForm] = useState({
    product_id: "",
    tx_type: "IN",
    quantity: 1,
    note: "",
  });
  const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      product_id: Number(form.product_id),
      quantity: Number(form.quantity),
    });
  };
  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
      <select
        value={form.product_id}
        onChange={(e) => set("product_id", e.target.value)}
        required
      >
        <option value="">商品を選択</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>
            {p.sku} - {p.name}
          </option>
        ))}
      </select>
      <select
        value={form.tx_type}
        onChange={(e) => set("tx_type", e.target.value)}
      >
        <option value="IN">入庫（IN）</option>
        <option value="OUT">出庫（OUT）</option>
      </select>
      <input
        type="number"
        min="1"
        value={form.quantity}
        onChange={(e) => set("quantity", e.target.value)}
      />
      <input
        placeholder="メモ（任意）"
        value={form.note}
        onChange={(e) => set("note", e.target.value)}
      />
      <button type="submit">記録</button>
    </form>
  );
}
