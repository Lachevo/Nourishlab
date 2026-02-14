export interface User {
    id: number;
    username: string;
    email: string;
    profile?: Profile;
    is_staff: boolean;
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

export interface Recipe {
    id: number;
    title: string;
    image?: string;
    prep_time_minutes: number;
    cook_time_minutes?: number;
    servings: number;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    ingredients: string;
    instructions: string;
    tags?: string;
}

export interface MealPlan {
    id: number;
    start_date: string;
    end_date: string;
    content?: string; // Legacy
    structured_plan?: any; // JSON structure { "Monday": { "Breakfast": recipeId... } }
    created_at: string;
}

export interface WeeklyUpdate {
    id: number;
    date: string;
    current_weight: number;
    notes: string;
    waist_cm?: number;
    hips_cm?: number;
    chest_cm?: number;
    arm_cm?: number;
    thigh_cm?: number;
    energy_level?: number;
    compliance_score?: number;
    photo_front?: string;
    photo_side?: string;
    photo_back?: string;
}

export interface FoodLog {
    id: number;
    date: string;
    meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
    content: string;
    image?: string;
    created_at: string;
}

export interface Message {
    id: number;
    sender: string;
    recipient: string;
    content: string;
    timestamp: string;
    is_read: boolean;
}

export interface LabResult {
    id: number;
    title: string;
    file: string;
    uploaded_at: string;
    description: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
}
