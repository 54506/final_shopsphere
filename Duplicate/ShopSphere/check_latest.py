import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ShopSphere.settings')
django.setup()

from deliveryAgent.models import DeliveryAgentProfile

def check_latest_agent():
    try:
        agent = DeliveryAgentProfile.objects.latest('created_at')
        print(f"Latest Agent ID: {agent.id}")
        print(f"User: {agent.user.email}")
        print(f"Created At: {agent.created_at}")
        
        docs = {
            'aadhar_card_file': agent.aadhar_card_file,
            'pan_card_file': agent.pan_card_file,
            'license_file': agent.license_file,
            'selfie_with_id': agent.selfie_with_id,
        }
        
        for name, file in docs.items():
            print(f"- {name}: {'FOUND' if file else 'EMPTY'} ({file})")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_latest_agent()
