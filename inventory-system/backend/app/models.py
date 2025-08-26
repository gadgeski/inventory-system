from datetime import datetime
from enum import Enum
from . import db

class TxType(str, Enum):
    IN = "IN"
    OUT = "OUT"

class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(64), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    unit = db.Column(db.String(32), nullable=True)  # 例: "pcs", "kg"
    reorder_point = db.Column(db.Integer, nullable=False, default=0)
    stock_quantity = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    transactions = db.relationship("InventoryTransaction", back_populates="product", lazy="dynamic")

class InventoryTransaction(db.Model):
    __tablename__ = "inventory_transactions"
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False, index=True)
    tx_type = db.Column(db.Enum(TxType), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)  # 正の値のみ
    note = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    balance_after = db.Column(db.Integer, nullable=False)  # 取引後残量を記録（監査用）

    product = db.relationship("Product", back_populates="transactions")
