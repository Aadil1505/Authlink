// types.ts

export interface UserProfile {
    id: string
    first_name: string
    last_name: string
    role: string
    major: string
    email: string
    maker_id: string
    h700: string
    created_at: string
    updated_at: string
    profile_picture: string
  }


  export interface TrainingTemplate {
    id: number
    title: string
    description: string
    created_at: string
    updated_at: string
  }

  export interface UserTraining {
    id: string
    user_id: string
    training_template_id: string
    status: 'incomplete' | 'completed'
    created_at: string
    updated_at: string
    template_id: string
    template_title: string
    template_description: string
    issuer_id: string
    issuer_first_name: string
    issuer_last_name: string  
  }
  
  export interface CertificationTemplate {
    id: number
    title: string
    description: string
    created_at: string
    updated_at: string
  }

  export interface UserCertification {
    id: string;
    user_id: string;
    certification_template_id: string;
    issuer_id: string;
    status: "incomplete" | "completed";
    created_at: string;
    updated_at: string;
    template_id: number;
    template_title: string;
    template_description: string;
    issuer_first_name: string;
    issuer_last_name: string;
  }
  
  export interface UserTimeStats {
    total_visits: string;
    total_time: string;   // Format: "HH:MM:SS"
    current_session: string | null;  // Format: "HH:MM:SS" or null if not checked in
  }