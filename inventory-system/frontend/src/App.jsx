import React from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import TransactionsPage from "./pages/TransactionsPage";
import ReorderPage from "./pages/ReorderPage";

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    style={({ isActive }) => ({
      marginRight: 16,
      fontWeight: isActive ? "700" : "400",
    })}
  >
    {children}
  </NavLink>
);

export default function App() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22 }}>
          <Link to="/">在庫管理</Link>
        </h1>
        <nav>
          <NavItem to="/">商品</NavItem>
          <NavItem to="/tx">入出庫</NavItem>
          <NavItem to="/reorder">発注点</NavItem>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/tx" element={<TransactionsPage />} />
        <Route path="/reorder" element={<ReorderPage />} />
      </Routes>
    </div>
  );
}
