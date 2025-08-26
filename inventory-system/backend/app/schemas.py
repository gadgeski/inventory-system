from flask_marshmallow import Marshmallow
from marshmallow import fields, validates, ValidationError
from .models import Product, InventoryTransaction, TxType

ma = Marshmallow()

class ProductSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Product
        load_instance = True

    id = ma.auto_field()
    sku = ma.auto_field()
    name = ma.auto_field()
    description = ma.auto_field()
    unit = ma.auto_field()
    reorder_point = ma.auto_field()
    stock_quantity = ma.auto_field()
    created_at = ma.auto_field()
    updated_at = ma.auto_field()

class TransactionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = InventoryTransaction
        load_instance = True

    id = ma.auto_field()
    product_id = ma.auto_field()
    tx_type = fields.String()
    quantity = ma.auto_field()
    note = ma.auto_field()
    created_at = ma.auto_field()
    balance_after = ma.auto_field()

    @validates("tx_type")
    def validate_type(self, value):
        if value not in (t.value for t in TxType):
            raise ValidationError("tx_type must be 'IN' or 'OUT'.")

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
tx_schema = TransactionSchema()
txs_schema = TransactionSchema(many=True)
