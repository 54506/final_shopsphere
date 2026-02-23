import os
import django
from django.conf import settings
from django.template.loader import render_to_string

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ShopSphere.settings')
django.setup()

try:
    print("Testing invoice_vendor_order.html...")
    render_to_string('invoice_vendor_order.html', {'vendor': {}, 'order': {}, 'items': [], 'vendor_subtotal': 0})
    print("SUCCESS")
    
    print("Testing invoice_vendor_commission.html...")
    render_to_string('invoice_vendor_commission.html', {'vendor': {}, 'order': {}, 'items': [], 'vendor_subtotal': 0, 'total_commission': 0, 'net_earnings': 0})
    print("SUCCESS")

except Exception:
    import traceback
    traceback.print_exc()

