import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ShopSphere.settings')
django.setup()
from vendor.models import Product, VendorProfile
from user.models import Review

print(f"Total Products: {Product.objects.count()}")
print(f"Active Products: {Product.objects.filter(status='active', is_blocked=False).count()}")
for p in Product.objects.all():
    avg = p.reviews.aggregate(django.db.models.Avg('rating'))['rating__avg']
    print(f"Product: {p.name}, Price: {p.price}, Rating: {avg}, Images: {p.images.count()}")

print(f"Total Reviews: {Review.objects.count()}")
