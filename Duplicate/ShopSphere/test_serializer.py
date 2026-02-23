import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ShopSphere.settings')
django.setup()

from deliveryAgent.models import DeliveryAgentProfile
from superAdmin.serializers import AdminDeliveryAgentDetailSerializer
from rest_framework.request import Request
from django.test import RequestFactory

def test_serializer(agent_id):
    try:
        agent = DeliveryAgentProfile.objects.get(id=agent_id)
        factory = RequestFactory()
        request = factory.get('/')
        serializer = AdminDeliveryAgentDetailSerializer(agent, context={'request': request})
        
        print(f"Serializer Data for Agent {agent_id}:")
        data = serializer.data
        print(json.dumps(data, indent=2))
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_serializer(10)
