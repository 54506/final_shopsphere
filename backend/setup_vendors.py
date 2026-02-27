
import os
import django
try:
    import dotenv
    dotenv.load_dotenv()
except ImportError:
    pass

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ShopSphere.settings')
django.setup()

from user.models import AuthUser
from vendor.models import VendorProfile

for v_id in [1, 5, 6]:
    email = f'vendor{v_id}@example.com'
    u, created = AuthUser.objects.get_or_create(
        email=email, 
        defaults={'username': f'vendor{v_id}', 'role': 'vendor'}
    )
    VendorProfile.objects.get_or_create(
        id=v_id, 
        defaults={
            'user': u, 
            'shop_name': f'Shop {v_id}', 
            'address': 'Manual Address', 
            'approval_status': 'approved'
        }
    )
print("Vendors created.")
