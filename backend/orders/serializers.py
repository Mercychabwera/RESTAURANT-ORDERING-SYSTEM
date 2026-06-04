from django.utils import timezone
from rest_framework import serializers

from .models import Bill, MenuItem, Order, OrderItem


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ["id", "name", "description", "category", "price_mwk", "image_url", "available"]


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source="menu_item.name", read_only=True)
    line_total_mwk = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "menu_item", "menu_item_name", "quantity", "unit_price_mwk", "line_total_mwk"]
        read_only_fields = ["unit_price_mwk"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    total_mwk = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "customer_name", "table_number", "status", "items", "total_mwk", "created_at", "updated_at"]
        read_only_fields = ["status"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            menu_item = item_data["menu_item"]
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=item_data["quantity"],
                unit_price_mwk=menu_item.price_mwk,
            )
        Bill.objects.create(order=order)
        return order


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]


class BillSerializer(serializers.ModelSerializer):
    order_number = serializers.IntegerField(source="order.id", read_only=True)
    customer_name = serializers.CharField(source="order.customer_name", read_only=True)
    amount_mwk = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Bill
        fields = ["id", "order", "order_number", "customer_name", "amount_mwk", "payment_status", "payment_method", "paid_at"]
        read_only_fields = ["paid_at"]

    def update(self, instance, validated_data):
        instance.payment_status = validated_data.get("payment_status", instance.payment_status)
        instance.payment_method = validated_data.get("payment_method", instance.payment_method)
        if instance.payment_status == "PAID" and instance.paid_at is None:
            instance.paid_at = timezone.now()
        instance.save()
        return instance
