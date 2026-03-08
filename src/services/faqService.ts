import { supabase } from "@/lib/supabaseClient";
import { FAQ } from "@/types/faq";

export const fetchFaqs = async (): Promise<FAQ[]> => {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data as FAQ[];
};
