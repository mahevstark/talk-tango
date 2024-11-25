import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-url-polyfill/auto'
import { createClient } from "@supabase/supabase-js";

// Better put your these secret keys in .env file
export const supabase = createClient("https://blhhzuhttytiywytdqzb.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsaGh6dWh0dHl0aXl3eXRkcXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI5MjQ3MTgsImV4cCI6MTk4ODUwMDcxOH0.kRrq8TljI7_Cl_EKZRFKheEuDyZVgVky4iYiMYWximQ", {
    localStorage: AsyncStorage,
    detectSessionInUrl: false, // Prevents Supabase from evaluating window.location.href, breaking mobile
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});