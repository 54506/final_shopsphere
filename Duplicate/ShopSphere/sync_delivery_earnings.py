import os
import django
from decimal import Decimal
from django.db.models import Sum

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ShopSphere.settings')
django.setup()

from deliveryAgent.models import DeliveryAgentProfile, DeliveryCommission

print("Starting earnings sync...")
for agent in DeliveryAgentProfile.objects.all():
    # Calculate lifetime earnings from approved/paid commissions
    total = DeliveryCommission.objects.filter(
        agent=agent,
        status__in=['approved', 'paid']
    ).aggregate(Sum('total_commission'))['total_commission__sum'] or Decimal('0.00')
    
    if agent.total_earnings != total:
        print(f"Repairing Agent {agent.user.username}: {agent.total_earnings} -> {total}")
        agent.total_earnings = total
        agent.save()

print("Sync complete.")
