import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage'

// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseKey = process.env.SUPABASE_KEY!;
const supabaseUrl = 'https://wkxhkjlklfqmenzetcsp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndreGhramxrbGZxbWVuemV0Y3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxMzExNzQsImV4cCI6MjA1NTcwNzE3NH0.CSORKs7IgvTjp8fJf-rjlVzdDZ1EkMQrAWh6VN3JwB0';
const supabaseRealtimeUrl = 'wss://wkxhkjlklfqmenzetcsp.supabase.co/realtime/v1';


export const supabase = createClient(supabaseUrl, supabaseKey, 
//     {
//     realtime: {
//        reconnectAfterMs: (attempt: number) => [1000, 2000, 5000][attempt - 1] || 10000
//     },
//     auth: {
//         storage: AsyncStorage,
//         autoRefreshToken: true,
//         persistSession: true,
//         detectSessionInUrl: false,
//       },
// }
);