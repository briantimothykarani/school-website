import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wlublhamagnebcyauaws.supabase.co";
const supabaseKey = "sb_publishable_abvi7fFDWzTt30TA7cn1fA_UKheTB8d"; // publishable key
export const supabase = createClient(supabaseUrl, supabaseKey);
