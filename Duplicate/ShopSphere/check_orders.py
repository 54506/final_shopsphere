import os, django
os.environ['DJANGO_SETTINGS_MODULE'] = 'ShopSphere.settings'
django.setup()

from user.models import Order, OrderItem, AuthUser
from vendor.models import Product, VendorProfile

print("=== ORDER ITEMS WITH VENDORS ===")
order_items = OrderItem.objects.select_related('order', 'vendor', 'vendor__user', 'product').all()
if not order_items.exists():
    print("No order items found.")
else:
    for item in order_items:
        buyer = item.order.user.email
        vendor_user = item.vendor.user.email if (item.vendor and item.vendor.user) else "N/A"
        print(f"Item ID: {item.id}")
        print(f"  Order: {item.order.order_number}")
        print(f"  Product: {item.product_name}")
        print(f"  Buyer: {buyer}")
        print(f"  Vendor User: {vendor_user}")
        print(f"  Vendor Shop: {item.vendor.shop_name if item.vendor else 'N/A'}")
        print(f"  Status: {item.vendor_status}")
        print("-" * 30)

print("\n=== VENDOR PROFILES ===")
for v in VendorProfile.objects.select_related('user').all():
    print(f"Shop: {v.shop_name} | User: {v.user.email} | Role: {v.user.role} | Status: {v.approval_status}")
