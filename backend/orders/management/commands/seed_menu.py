from django.core.management.base import BaseCommand

from orders.models import MenuItem


NSIMA = "https://malawiplus.com/wp-content/uploads/2022/05/food1.jpg"
NSIMA_CHICKEN = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Food%20in%20Malawi%20-%20chicken%20-%20green%20plate%20-%20Jan%202018.jpg?width=900"
NSIMA_PLATE = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Nsima%20-%20on%20a%20plate%20-%20Malawi%20-%20Jan%202018%20.jpg?width=700"
CHAMBO = "https://malawiplus.com/wp-content/uploads/2022/05/food3.jpg"
FRIED_CHAMBO = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Fried%20Chambo.JPG?width=700"
CHIWAYA = "https://malawiplus.com/wp-content/uploads/2022/05/Chiwaya.jpg"
LOCAL_DISH = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Local%20Dish%20Local%20Restaurant.jpg?width=900"
MALAWIAN_ASSORTED = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Assorted%20Malawian%20food%2C%20Blantyre.jpg?width=900"
OKRA_TOMATO = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Okra%20and%20Tomato%2C%20malawi.jpg?width=800"
GREENS = "https://commons.wikimedia.org/wiki/Special:Redirect/file/N%27khwani%20otendera.JPG?width=800"
BOILED_CHICKEN = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Boiled%20local%20chicken.JPG?width=700"
MANDAZI = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Malawi%27s%20fritters.JPG?width=700"
PIZZA = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Pepperoni%20pizza.jpg?width=900"
BURGER = "https://commons.wikimedia.org/wiki/Special:Redirect/file/Big%20Mac%20hamburger.jpg?width=900"


MENU_ITEMS = [
    ("Nsima with Fish", "Fresh fish served with nsima and vegetables.", "Local Meals", 6500, CHAMBO),
    ("Rice with Chicken", "Steamed rice with chicken relish and salad.", "Rice Dishes", 6000, NSIMA_CHICKEN),
    ("Rice with Beef", "Rice served with beef relish and vegetables.", "Rice Dishes", 7000, MALAWIAN_ASSORTED),
    ("Chips with Chicken", "Malawian chiwaya chips with chicken.", "Fast Foods", 7500, CHIWAYA),
    ("Plain Chips", "Local chiwaya-style fried chips.", "Fast Foods", 3000, CHIWAYA),
    ("Pizza", "House pizza served from the restaurant fast-food menu.", "Fast Foods", 9500, PIZZA),
    ("Burger", "Burger from the restaurant fast-food menu.", "Fast Foods", 6500, BURGER),
    ("Nsima with Eggs", "Nsima served with eggs and local relish.", "Local Meals", 4000, NSIMA_PLATE),
    ("Nsima with Chicken", "Nsima with local chicken relish and greens.", "Local Meals", 6500, NSIMA_CHICKEN),
    ("Nsima with Beef", "Nsima with beef relish and vegetables.", "Local Meals", 7000, MALAWIAN_ASSORTED),
    ("Nsima with Beans", "Nsima with bean relish and leafy greens.", "Local Meals", 3500, NSIMA_PLATE),
    ("Rice with Beans", "Steamed rice with bean relish.", "Rice Dishes", 4000, MALAWIAN_ASSORTED),
    ("Rice with Fish", "Rice served with fish relish and salad.", "Rice Dishes", 6500, FRIED_CHAMBO),
    ("Chicken Curry", "Chicken curry served with rice or nsima.", "Rice Dishes", 8000, BOILED_CHICKEN),
    ("Beef Curry", "Beef relish served with rice.", "Rice Dishes", 8500, MALAWIAN_ASSORTED),
    ("Vegetable Stir Fry", "Mixed local vegetables served with rice.", "Vegetarian", 5000, OKRA_TOMATO),
    ("Chicken Wrap", "Chicken wrap from the fast-food menu.", "Fast Foods", 5500, BOILED_CHICKEN),
    ("Beef Sausage and Chips", "Sausage with local chiwaya chips.", "Fast Foods", 4500, CHIWAYA),
    ("Grilled Fish and Chips", "Fish and chips served Malawian style.", "Fast Foods", 8500, "https://commons.wikimedia.org/wiki/Special:Redirect/file/Fish%20and%20chips%2C%20the%20Malawian%20way.jpg?width=800"),
    ("Chicken Salad", "Chicken with fresh local vegetables.", "Light Meals", 5500, GREENS),
    ("Mandasi Plate", "Traditional mandasi served with tea.", "Breakfast", 2500, MANDAZI),
    ("Tea and Scones", "Tea with a local breakfast plate.", "Breakfast", 3000, MANDAZI),
]


class Command(BaseCommand):
    help = "Seeds the database with Malawi Kwacha menu items."

    def handle(self, *args, **options):
        for name, description, category, price_mwk, image_url in MENU_ITEMS:
            MenuItem.objects.update_or_create(
                name=name,
                defaults={
                    "description": description,
                    "category": category,
                    "price_mwk": price_mwk,
                    "image_url": image_url,
                    "available": True,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"Seeded {len(MENU_ITEMS)} menu items."))
