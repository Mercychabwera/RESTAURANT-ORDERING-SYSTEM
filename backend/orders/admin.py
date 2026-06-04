from django.contrib import admin

from .models import Bill, MenuItem, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price_mwk", "available")
    list_filter = ("category", "available")
    search_fields = ("name",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_name", "table_number", "status", "created_at")
    list_filter = ("status", "created_at")
    inlines = [OrderItemInline]


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "amount_mwk", "payment_status", "payment_method", "created_at")
    list_filter = ("payment_status", "payment_method")
