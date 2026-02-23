import os
import django
import random
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ShopSphere.settings')
django.setup()

from vendor.models import Product, VendorProfile, ProductImage
from user.models import AuthUser, Review


def populate_trending():
    print("Populating trending products...")
    
    # Get or create a vendor
    vendor_user, _ = AuthUser.objects.get_or_create(
        email="trending@vendor.com",
        defaults={"username": "trending_vendor", "role": "user"}
    )
    if not vendor_user.password:
        vendor_user.set_password("trending123")
        vendor_user.save()
        
    vendor_profile, _ = VendorProfile.objects.get_or_create(
        user=vendor_user,
        defaults={
            "shop_name": "Trending Trends",
            "shop_description": "We sell the most trending items.",
            "address": "123 Trend St",
            "business_type": "retail",
            "approval_status": "approved"
        }
    )
    
    # Categories are CharFields now
    category_slug = "electronics"
    
    # Create some trending products
    trending_items = [
        {"name": "Ultra Smart 4K TV", "price": 1200.00, "description": "Crisp visuals for every room."},
        {"name": "Wireless Noise Cancelling Pods", "price": 150.00, "description": "Pure sound, no distractions."},
        {"name": "Next-Gen Gaming Console", "price": 499.00, "description": "Step into the future of gaming."},
    ]
    
    users = AuthUser.objects.filter(role='user')[:5]
    if users.count() < 3:
        # Create some dummy users if needed
        for i in range(3):
            u, _ = AuthUser.objects.get_or_create(
                email=f"user{i}@example.com",
                defaults={"username": f"user{i}"}
            )
            if not u.password:
                u.set_password("pass123")
                u.save()
        users = AuthUser.objects.filter(role='user')[:5]

    for item in trending_items:
        product, created = Product.objects.get_or_create(
            name=item["name"],
            vendor=vendor_profile,
            defaults={
                "description": item["description"],
                "price": Decimal(str(item["price"])),
                "quantity": 100,
                "category": category_slug,
            }
        )
        
        # Add a few images (placeholder/empty) so the loop works
        import base64
        # 1x1 gray pixel PNG
        dummy_image = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==")
        
        if product.images.count() < 4:
            for i in range(4):
                ProductImage.objects.create(
                    product=product,
                    image_filename=f"trending_{i}.jpg",
                    image_mimetype="image/png",
                    image_data=dummy_image
                )
        
        # Add high-rated reviews
        for user in users:
            Review.objects.update_or_create(
                Product=product,
                user=user,
                defaults={
                    "rating": random.randint(4, 5),
                    "comment": "Mind-blowing product!",
                    "reviewer_name": user.username
                }
            )
            
    print("Trending products populated successfully!")

if __name__ == "__main__":
    populate_trending()