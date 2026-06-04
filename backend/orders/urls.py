from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BillViewSet, MenuItemViewSet, OrderViewSet, health_check, sales_report


router = DefaultRouter()
router.register("menu-items", MenuItemViewSet)
router.register("orders", OrderViewSet)
router.register("bills", BillViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("health/", health_check),
    path("sales-report/", sales_report),
]
