import React, { useEffect, useState } from "react";
import { api } from "../api";
import TransactionForm from "../components/TransactionForm";

export default function TransactionsPage() {
  const [products, setProducts] = useState([]);
  const [txs, setTxs] = useState([]);

  const load = async () => {
    const [p, t] = await Promise.all([
      api.listProducts(),
      api.listTransactions(),
    ]);
    setProducts(p);
    setTxs(t);
  };
  useEffect(() => {
    load();
  }, []);

  const submit = async (payload) => {
    await api.createTransaction(payload);
    await load();
    alert("記録しました");
  };

  return (
    <div>
      <h2>入出庫</h2>
      <TransactionForm products={products} onSubmit={submit} />
      <h3 style={{ marginTop: 24 }}>履歴（新しい順）</h3>
      <table
        border="1"
        cellPadding="6"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>商品ID</th>
            <th>種別</th>
            <th>数量</th>
            <th>残量</th>
            <th>メモ</th>
            <th>日時</th>
          </tr>
        </thead>
        <tbody>
          {txs.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.product_id}</td>
              <td>{tx.tx_type}</td>
              <td>{tx.quantity}</td>
              <td>{tx.balance_after}</td>
              <td>{tx.note || "-"}</td>
              <td>{new Date(tx.created_at).toLocaleString()}</td>
            </tr>
          ))}
          {txs.length === 0 && (
            <tr>
              <td colSpan="7">履歴がありません</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
