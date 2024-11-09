import { authFetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

interface IAuthRedirect {
  to: string;
  condition: "isLoggedIn" | "isLoggedOut";
  role: "Administrator" | "Predstavnik" | "Suvlasnik";
}

interface IMe {
  email: string;
  role: string;
}

export default function AuthRedirect({ to, condition, role }: IAuthRedirect) {
  const route = useRouter();
  const { data, isLoading } = useSWR(swrKeys.me, authFetcher<IMe>);

  useEffect(() => {
    if (isLoading) return;
    console.log(data);
    console.log(condition);
    if (!data && condition == "isLoggedOut") {
      route.push(to);
    }
    if (data && condition == "isLoggedIn" && data.role == role) {
      route.push(to);
    }
  }, [data, isLoading, to, condition, route]);

  return null;
}
