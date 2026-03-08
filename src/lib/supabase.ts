/*import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wlublhamagnebcyauaws.supabase.co";
const supabaseKey = "sb_publishable_abvi7fFDWzTt30TA7cn1fA_UKheTB8d"; // publishable key
export const supabase = createClient(supabaseUrl, supabaseKey);
 */

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://wlublhamagnebcyauaws.supabase.co",
  "sb_publishable_abvi7fFDWzTt30TA7cn1fA_UKheTB8d",
  {
    // optional, but you can force JSON accept
    global: {
      headers: {
        Accept: "application/json",
      },
    },
  },
);
