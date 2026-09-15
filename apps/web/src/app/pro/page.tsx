import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
export default async function ProHome() {
  const session = await getSession();
  redirect(session?.role === "pro" ? "/pro/agenda" : "/pro/connexion");
}
