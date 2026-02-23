import os, django
os.environ['DJANGO_SETTINGS_MODULE'] = 'ShopSphere.settings'
django.setup()

from user.models import OrderItem
from vendor.models import Product

print("=== REPAIRING ORDER ITEMS ===")
repaired_count = 0
for item in OrderItem.objects.filter(vendor__isnull=True):
    # Try to find a product with the same name
    possible_products = Product.objects.filter(name=item.product_name)
    if possible_products.exists():
        product = possible_products.first()
        item.product = product
        item.vendor = product.vendor
        item.save()
        print(f"Repaired Item {item.id}: Linked to Product '{product.name}' and Vendor '{product.vendor.shop_name}'")
        repaired_count += 1
    else:
        print(f"Failed to Repair Item {item.id}: No product found with name '{item.product_name}'")

print(f"\nTotal items repaired: {repaired_count}")
