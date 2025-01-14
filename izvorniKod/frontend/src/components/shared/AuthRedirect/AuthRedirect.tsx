import { authFetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { User } from "@/typings/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

interface IAuthRedirect {
  to: string;
  condition: "isLoggedIn" | "isLoggedOut";
  role?: "Administrator" | "Predstavnik" | "Suvlasnik";
}

interface IMe {
  email: string;
  role: string;
}

export default function AuthRedirect({ to, condition, role }: IAuthRedirect) {
  const route = useRouter();
  const { data, isLoading } = useSWR(swrKeys.me, authFetcher<User>);

  useEffect(() => {
    if (isLoading) return;
    console.log(data);
    console.log(condition);
    if (!data && condition == "isLoggedOut") {
      console.log("moram");
      route.push(to);
    }
    if (data && condition == "isLoggedIn") {
      if (!data.admin && role != "Administrator") route.push(to);
      if (data.admin && role == "Administrator") route.push(to);
      if (!role) route.push(to);
    }
  }, [data, isLoading, to, condition, role, route]);

  return null;
}
