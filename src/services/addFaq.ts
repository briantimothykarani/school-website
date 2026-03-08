import { supabase } from "@/lib/supabaseClient";

export const addFaq = async (
  question: string,
  answer: string,
  category?: string,
) => {
  const { error } = await supabase
    .from("faqs")
    .insert([{ question, answer, category }]);

  if (error) {
    console.error(error);
  }
};
