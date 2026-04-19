"use server";

import { supabase } from "@/lib/supabase";

type ActionState = {
  status: "idle" | "success" | "duplicate" | "error";
  message: string;
};

export async function joinWaitlist(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase();

  if (!email) {
    return { status: "error", message: "Email requis." };
  }

  const { error } = await supabase.from("waitlist").insert({ email });

  if (!error) {
    return {
      status: "success",
      message: "Parfait\u00a0! On vous contacte dès l'ouverture de la bêta.",
    };
  }

  // Postgres unique violation code
  if (error.code === "23505") {
    return {
      status: "duplicate",
      message: "Cet email est déjà sur la liste — on n'oublie pas\u00a0!",
    };
  }

  return {
    status: "error",
    message: "Erreur réseau, veuillez réessayer.",
  };
}
