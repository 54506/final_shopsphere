import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ShopSphere.settings')
django.setup()

from deliveryAgent.models import DeliveryAgentProfile

def approve_all_pending():
    pending = DeliveryAgentProfile.objects.filter(approval_status='pending')
    count = pending.count()
    if count == 0:
        print("No pending delivery agents found.")
        return

    updated = pending.update(approval_status='approved')
    print(f"Successfully approved {updated} delivery agents.")

if __name__ == "__main__":
    approve_all_pending()
