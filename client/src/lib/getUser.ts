import { refresh } from "@/api/auth";
import { User, UserWithToken } from "@/types/user";
import axios from "axios";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_API;

export async function getUser(): Promise<UserWithToken | undefined> {
  try {
    const cookieStore = await cookies();

    const { accessToken } = await refresh(cookieStore.toString());

    const user = await axios.get<User>(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return { ...user.data, accessToken };
  } catch (e) {
    return undefined;
  }
}
