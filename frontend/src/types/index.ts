export interface User {
    id: number;
    username: string;
    email: string;
    profile?: Profile;
}

export interface Profile {
    age?: number;
    height?: number;
    weight?: number;
    goals?: string;
    dietary_prefs?: string;
    allergies?: string;
    is_approved: boolean;
}

export interface MealPlan {
    id: number;
    start_date: string;
    end_date: string;
    content: string;
    created_at: string;
}

export interface WeeklyUpdate {
    id: number;
    date: string;
    current_weight: number;
    notes: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
}
