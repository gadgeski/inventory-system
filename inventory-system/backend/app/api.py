from flask import Blueprint, request, jsonify, abort
from sqlalchemy.exc import IntegrityError
from . import db
from .models import Product, InventoryTransaction, TxType
from .schemas import product_schema, products_schema, tx_schema, txs_schema

api_bp = Blueprint("api", __name__)

# ---- Products ----

@api_bp.get("/products")
def list_products():
    q = Product.query.order_by(Product.id.desc()).all()
    return products_schema.jsonify(q)

@api_bp.post("/products")
def create_product():
    data = request.get_json() or {}
    required = ["sku", "name"]
    if any(k not in data or not data[k] for k in required):
        abort(400, description="sku and name are required.")
    p = Product(
        sku=data["sku"],
        name=data["name"],
        description=data.get("description"),
        unit=data.get("unit"),
        reorder_point=int(data.get("reorder_point", 0)),
        stock_quantity=int(data.get("stock_quantity", 0)),
    )
    db.session.add(p)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        abort(400, description="SKU must be unique.")
    return product_schema.jsonify(p), 201

@api_bp.get("/products/<int:pid>")
def get_product(pid):
    p = Product.query.get_or_404(pid)
    return product_schema.jsonify(p)

@api_bp.put("/products/<int:pid>")
def update_product(pid):
    p = Product.query.get_or_404(pid)
    data = request.get_json() or {}
    for field in ["sku", "name", "description", "unit", "reorder_point", "stock_quantity"]:
        if field in data:
            setattr(p, field, data[field])
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        abort(400, description="SKU must be unique.")
    return product_schema.jsonify(p)

@api_bp.delete("/products/<int:pid>")
def delete_product(pid):
    p = Product.query.get_or_404(pid)
    db.session.delete(p)
    db.session.commit()
    return "", 204

# ---- Transactions ----

@api_bp.get("/transactions")
def list_transactions():
    product_id = request.args.get("product_id", type=int)
    q = InventoryTransaction.query
    if product_id:
        q = q.filter_by(product_id=product_id)
    q = q.order_by(InventoryTransaction.id.desc()).limit(500)  # 軽い上限
    return txs_schema.jsonify(q.all())

@api_bp.post("/transactions")
def create_transaction():
    data = request.get_json() or {}
    required = ["product_id", "tx_type", "quantity"]
    if any(k not in data for k in required):
        abort(400, description="product_id, tx_type, quantity are required.")

    p = Product.query.get_or_404(int(data["product_id"]))
    tx_type = data["tx_type"]
    qty = int(data["quantity"])
    if qty <= 0:
        abort(400, description="quantity must be > 0.")

    # 在庫更新はトランザクションで安全に
    try:
        if tx_type == TxType.IN.value:
            p.stock_quantity = p.stock_quantity + qty
        elif tx_type == TxType.OUT.value:
            if p.stock_quantity - qty < 0:
                abort(400, description="Insufficient stock for OUT transaction.")
            p.stock_quantity = p.stock_quantity - qty
        else:
            abort(400, description="tx_type must be 'IN' or 'OUT'.")

        tx = InventoryTransaction(
            product_id=p.id,
            tx_type=TxType(tx_type),
            quantity=qty,
            note=data.get("note"),
            balance_after=p.stock_quantity,
        )
        db.session.add(tx)
        db.session.commit()
        return tx_schema.jsonify(tx), 201
    except Exception as e:
        db.session.rollback()
        raise

# ---- Reorder (発注点到達) ----

@api_bp.get("/reorder")
def list_reorder_needed():
    items = Product.query.filter(Product.stock_quantity <= Product.reorder_point).order_by(Product.stock_quantity).all()
    return products_schema.jsonify(items)
