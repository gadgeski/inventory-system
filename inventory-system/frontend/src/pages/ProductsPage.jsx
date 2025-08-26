import React, { useEffect, useState } from "react";
import { api } from "../api";
import ProductForm from "../components/ProductForm";

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = async () => setItems(await api.listProducts());
  useEffect(() => {
    load();
  }, []);

  const create = async (payload) => {
    await api.createProduct(payload);
    setEditing(null);
    await load();
  };
  const update = async (id, payload) => {
    await api.updateProduct(id, payload);
    setEditing(null);
    await load();
  };
  const remove = async (id) => {
    if (confirm("削除しますか？")) {
      await api.deleteProduct(id);
      await load();
    }
  };

  return (
    <div>
      <h2>商品一覧</h2>
      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <ProductForm
          initial={editing}
          onSubmit={(payload) =>
            editing ? update(editing.id, payload) : create(payload)
          }
          onCancel={() => setEditing(null)}
        />
      </div>

      <table
        border="1"
        cellPadding="6"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>SKU</th>
            <th>商品名</th>
            <th>在庫</th>
            <th>単位</th>
            <th>発注点</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr
              key={p.id}
              style={{
                background:
                  p.stock_quantity <= p.reorder_point
                    ? "#ffe9e9"
                    : "transparent",
              }}
            >
              <td>{p.id}</td>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.stock_quantity}</td>
              <td>{p.unit || "-"}</td>
              <td>{p.reorder_point}</td>
              <td>
                <button onClick={() => setEditing(p)}>編集</button>{" "}
                <button onClick={() => remove(p.id)}>削除</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="7">商品がありません</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
