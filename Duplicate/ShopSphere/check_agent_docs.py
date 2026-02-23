import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ShopSphere.settings')
django.setup()

from deliveryAgent.models import DeliveryAgentProfile

def check_agent_docs(agent_id):
    try:
        agent = DeliveryAgentProfile.objects.get(id=agent_id)
        with open('doc_report.txt', 'w') as f:
            f.write(f"Agent ID: {agent.id}\n")
            f.write(f"User: {agent.user.email}\n")
            
            docs = {
                'aadhar_card_file': agent.aadhar_card_file,
                'pan_card_file': agent.pan_card_file,
                'license_file': agent.license_file,
                'selfie_with_id': agent.selfie_with_id,
                'id_proof_file': agent.id_proof_file,
                'vehicle_registration': agent.vehicle_registration,
                'vehicle_insurance': agent.vehicle_insurance,
                'additional_documents': agent.additional_documents
            }
            
            f.write("\nDocument Files Status:\n")
            for name, file in docs.items():
                f.write(f"- {name}: {'FOUND' if file else 'EMPTY'} ({file})\n")
            
    except DeliveryAgentProfile.DoesNotExist:
        print(f"Agent with ID {agent_id} not found.")

if __name__ == "__main__":
    check_agent_docs(10)
