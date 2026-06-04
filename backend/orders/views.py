from django.db.models import Count, Sum
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

    return Response(
        {
            "total_sales_mwk": total_sales,
            "paid_orders": paid_orders,
            "open_bills": open_bills,
            "popular_items": list(popular_items),
        }
    )
