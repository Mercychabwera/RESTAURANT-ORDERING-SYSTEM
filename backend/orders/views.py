from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Bill, MenuItem, Order, OrderItem
from .serializers import BillSerializer, MenuItemSerializer, OrderSerializer, OrderStatusSerializer


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related("items__menu_item").all()

    def get_serializer_class(self):
        if self.action in ["partial_update", "update"]:
            return OrderStatusSerializer
        return OrderSerializer


class BillViewSet(viewsets.ModelViewSet):
    queryset = Bill.objects.select_related("order").all()
    serializer_class = BillSerializer


@api_view(["GET"])
def health_check(request):
    return Response({"status": "ok", "message": "Django backend connected"})


@api_view(["GET"])
def sales_report(request):
    paid_bills = Bill.objects.filter(payment_status="PAID")
    total_sales = sum(bill.amount_mwk for bill in paid_bills)
    paid_orders = paid_bills.count()
    open_bills = Bill.objects.filter(payment_status="UNPAID").count()
    
    popular_items = (
        OrderItem.objects.values("menu_item__name")
        .annotate(quantity_sold=Sum("quantity"), order_count=Count("order", distinct=True))
        .order_by("-quantity_sold")[:10]
    )
    
    # Additional metrics
    total_orders = Order.objects.count()
    total_items_sold = OrderItem.objects.aggregate(total=Sum("quantity"))["total"] or 0
    
    # Today's sales
    today = timezone.now().date()
    today_sales = sum(
        bill.amount_mwk 
        for bill in Bill.objects.filter(payment_status="PAID", created_at__date=today)
    )
    today_orders = Order.objects.filter(created_at__date=today).count()
    
    # Average order value
    avg_order_value = (total_sales / paid_orders) if paid_orders > 0 else 0
    
    # Category breakdown
    category_sales = (
        OrderItem.objects.values("menu_item__category")
        .annotate(total_quantity=Sum("quantity"), total_revenue=Sum("quantity"))
        .order_by("-total_quantity")
    )

    return Response(
        {
            "total_sales_mwk": total_sales,
            "paid_orders": paid_orders,
            "open_bills": open_bills,
            "total_orders": total_orders,
            "total_items_sold": total_items_sold,
            "today_sales_mwk": today_sales,
            "today_orders": today_orders,
            "average_order_value_mwk": round(avg_order_value, 2),
            "popular_items": list(popular_items),
            "category_breakdown": list(category_sales),
        }
    )
