import os, django
os.environ['DJANGO_SETTINGS_MODULE'] = 'ShopSphere.settings'
django.setup()

from vendor.models import Product, ProductImage
from user.models import AuthUser, Order, Review, Address, Cart
from django.db.models import Count, Avg

lines = []
lines.append("=== PRODUCTS ===")
for p in Product.objects.annotate(img_count=Count('images'), avg=Avg('reviews__rating')).order_by('id'):
    lines.append(f"  ID={p.id} | {p.name[:35]} | status={p.status} | images={p.img_count} | rating={round(p.avg or 0, 1)}")

lines.append("")
lines.append("=== USERS ===")
for u in AuthUser.objects.order_by('id'):
    lines.append(f"  ID={u.id} | email={u.email} | role={u.role} | active={u.is_active}")

lines.append("")
lines.append("=== ORDERS ===")
for o in Order.objects.order_by('-id')[:10]:
    lines.append(f"  ID={o.id} | #{o.order_number} | status={o.status} | total={o.total_amount}")

lines.append("")
lines.append("=== SUMMARY ===")
lines.append(f"Products: {Product.objects.count()}")
lines.append(f"  active/approved: {Product.objects.filter(status__in=['active','approved']).count()}")
lines.append(f"ProductImages: {ProductImage.objects.count()}")
lines.append(f"  with image_data: {ProductImage.objects.exclude(image_data__isnull=True).count()}")
lines.append(f"Users: {AuthUser.objects.count()}")
lines.append(f"Orders: {Order.objects.count()}")
lines.append(f"Reviews: {Review.objects.count()}")
lines.append(f"Addresses: {Address.objects.count()}")

print('\n'.join(lines))
