import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkadqrtufhzglvdiubgi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWRxcnR1Zmh6Z2x2ZGl1YmdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NjIwNjUsImV4cCI6MjA4MjQzODA2NX0.nmlUkJpMH5Vg1c7rj4NpQPxIg-cVOoJz48OvEJVTJBE';

export const supabase = createClient(supabaseUrl, supabaseKey);