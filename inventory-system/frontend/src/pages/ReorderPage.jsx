import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function ReorderPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.listReorder().then(setItems);
  }, []);
  return (
    <div>
      <h2>発注点に達した商品</h2>
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
            <th>発注点</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} style={{ background: "#fff5d1" }}>
              <td>{p.id}</td>
              <td>{p.sku}</td>
              <td>{p.name}</td>
              <td>{p.stock_quantity}</td>
              <td>{p.reorder_point}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="5">ありません</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
