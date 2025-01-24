"use client";
import BuildingListContainer from "@/components/features/BuildingList/BuildingListContainer/BuildingListContainer";
import AuthRedirect from "@/components/shared/AuthRedirect/AuthRedirect";
import { authFetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { User } from "@/typings/user";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function BuildingsListPage() {
  const { data, isLoading, error } = useSWR<User>(swrKeys.me, authFetcher);
  if (error) {
    if (error.status !== 401) return <Box>Something went wrong...</Box>;
    else return <Box>Nemate pristup toj stranici.</Box>;
  }
  if (isLoading || !data) {
    return <Box>Loading...</Box>;
  } else {
    return (
      <>
        <AuthRedirect to="/" condition="isLoggedOut" role="Administrator" />
        <AuthRedirect
          to="/create"
          condition="isLoggedIn"
          role="Administrator"
        />
        {data && (
          <BuildingListContainer podaci={data?.podaci}></BuildingListContainer>
        )}
      </>
    );
  }
}
