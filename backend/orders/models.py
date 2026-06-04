from django.db import models


class MenuItem(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=60, default="Main Meal")
    price_mwk = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(blank=True)
    available = models.BooleanField(default=True)

    class Meta:
        ordering = ["category", "name"]

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ("PLACED", "Placed"),
        ("PREPARING", "Preparing"),
        ("READY", "Ready"),
        ("SERVED", "Served"),
        ("CANCELLED", "Cancelled"),
    ]

    customer_name = models.CharField(max_length=120)
    table_number = models.CharField(max_length=20, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PLACED")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def total_mwk(self):
        return sum(item.line_total_mwk for item in self.items.all())

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price_mwk = models.DecimalField(max_digits=10, decimal_places=2)

    @property
    def line_total_mwk(self):
        return self.quantity * self.unit_price_mwk

    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name}"


class Bill(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("UNPAID", "Unpaid"),
        ("PAID", "Paid"),
    ]
    PAYMENT_METHOD_CHOICES = [
        ("CASH", "Cash"),
        ("CARD", "Card"),
        ("MOBILE_MONEY", "Mobile Money"),
    ]

    order = models.OneToOneField(Order, related_name="bill", on_delete=models.CASCADE)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="UNPAID")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def amount_mwk(self):
        return self.order.total_mwk

    def __str__(self):
        return f"Bill for order #{self.order_id}"
