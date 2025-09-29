import { api } from "@/api";
import { refresh } from "@/api/auth";
import { UserWithToken } from "@/types/user";
import { cookies } from "next/headers";

export async function getUser(): Promise<UserWithToken | undefined> {
  try {
    const cookieStore = await cookies();

    const { accessToken } = (await refresh(cookieStore.toString())).data;

    const user = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return { accessToken: accessToken as string, ...user.data };
  } catch (e) {
    return undefined;
  }
}
