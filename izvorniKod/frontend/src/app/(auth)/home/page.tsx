"use client";
import BuildingListContainer from "@/components/features/BuildingList/BuildingListContainer/BuildingListContainer";
import AuthRedirect from "@/components/shared/AuthRedirect/AuthRedirect";
import { authFetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { User } from "@/typings/user";
import { Box, Heading } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function BuildingsListPage() {
  const router = useRouter();
  const { data, isLoading, error } = useSWR<User>(swrKeys.me, authFetcher);
  console.log(data);
  if (error) {
    if (error.status !== 401) return <Box>Something went wrong...</Box>;
  }
  if (isLoading) {
    return <Box>Loading...</Box>;
  } else {
    console.log(data);

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
