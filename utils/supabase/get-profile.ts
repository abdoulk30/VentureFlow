import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

// Wrapped in React's cache() so that if both the layout AND the page
// component call this during the same navigation/request, Supabase only
// gets hit once instead of twice. This doesn't make Supabase itself
// faster, but it removes a real, duplicate network round-trip that was
// happening on every single tab click.
export const getCurrentUserAndProfile = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile };
});