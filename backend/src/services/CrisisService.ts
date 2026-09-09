export interface EmergencyResource {
  name: string;
  contact: string;
  description: string;
  hours: string;
  region: string;
  category: 'HELPLINE' | 'EMERGENCY_SERVICES' | 'ORGANIZATION';
}

export interface CrisisEvaluationResult {
  isCrisis: boolean;
  riskLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'IMMEDIATE_DANGER';
  message: string;
  resources: EmergencyResource[];
}

export class CrisisService {
  private static DANGER_KEYWORDS = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 
    'self harm', 'cutting myself', 'hang myself', 'overdose', 'end it all',
    'no reason to live', 'better off dead'
  ];

  public static EMERGENCY_RESOURCES: EmergencyResource[] = [
    {
      name: 'Tele-MANAS (Govt of India National Tele-Mental Health Program)',
      contact: '14416 / 1800-891-4416',
      description: 'Free 24/7 tele-mental health services provided by NIMHANS and the Ministry of Health.',
      hours: '24/7 (Multi-lingual)',
      region: 'India',
      category: 'HELPLINE'
    },
    {
      name: 'KIRAN Mental Health Helpline',
      contact: '1800-599-0019',
      description: 'National helpline providing early screening, first-aid, psychological support and crisis management.',
      hours: '24/7',
      region: 'India',
      category: 'HELPLINE'
    },
    {
      name: 'Vandrevala Foundation Helpline',
      contact: '+91 9999 666 555',
      description: 'Free emotional support and crisis intervention services provided by trained counselors.',
      hours: '24/7',
      region: 'India',
      category: 'HELPLINE'
    },
    {
      name: 'AASRA Helpline',
      contact: '+91 98204 66726',
      description: '24/7 crisis intervention and suicide prevention helpline.',
      hours: '24/7',
      region: 'India',
      category: 'HELPLINE'
    },
    {
      name: 'Emergency Services (Ambulance / Police)',
      contact: '112 / 102',
      description: 'National Emergency Response System for immediate life safety emergencies.',
      hours: '24/7',
      region: 'India',
      category: 'EMERGENCY_SERVICES'
    }
  ];

  public static evaluateText(input: string): CrisisEvaluationResult {
    const lowerInput = input.toLowerCase();
    const matches = this.DANGER_KEYWORDS.filter(kw => lowerInput.includes(kw));

    if (matches.length > 0) {
      return {
        isCrisis: true,
        riskLevel: 'IMMEDIATE_DANGER',
        message: 'If you or someone you know is in immediate danger or distress, please reach out for help right away. You are not alone, and support is available 24/7.',
        resources: this.EMERGENCY_RESOURCES
      };
    }

    return {
      isCrisis: false,
      riskLevel: 'NONE',
      message: 'No immediate crisis signals detected.',
      resources: this.EMERGENCY_RESOURCES
    };
  }
}
