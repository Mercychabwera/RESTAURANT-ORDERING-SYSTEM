from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="MenuItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120, unique=True)),
                ("description", models.TextField(blank=True)),
                ("category", models.CharField(default="Main Meal", max_length=60)),
                ("price_mwk", models.DecimalField(decimal_places=2, max_digits=10)),
                ("available", models.BooleanField(default=True)),
            ],
            options={"ordering": ["category", "name"]},
        ),
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("customer_name", models.CharField(max_length=120)),
                ("table_number", models.CharField(blank=True, max_length=20)),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("PLACED", "Placed"),
                            ("PREPARING", "Preparing"),
                            ("READY", "Ready"),
                            ("SERVED", "Served"),
                            ("CANCELLED", "Cancelled"),
                        ],
                        default="PLACED",
                        max_length=20,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name="Bill",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                (
                    "payment_status",
                    models.CharField(choices=[("UNPAID", "Unpaid"), ("PAID", "Paid")], default="UNPAID", max_length=20),
                ),
                (
                    "payment_method",
                    models.CharField(
                        blank=True,
                        choices=[("CASH", "Cash"), ("CARD", "Card"), ("MOBILE_MONEY", "Mobile Money")],
                        max_length=20,
                    ),
                ),
                ("paid_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("order", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="bill", to="orders.order")),
            ],
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("quantity", models.PositiveIntegerField(default=1)),
                ("unit_price_mwk", models.DecimalField(decimal_places=2, max_digits=10)),
                ("menu_item", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to="orders.menuitem")),
                ("order", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="items", to="orders.order")),
            ],
        ),
    ]
