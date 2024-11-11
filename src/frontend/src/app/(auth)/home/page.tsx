"use client";

import AuthRedirect from "@/components/shared/AuthRedirect/AuthRedirect";
import { authFetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { Box, Heading } from "@chakra-ui/react";
import useSWR from "swr";

export default function BuildingsListPage() {
  const { data, isLoading, error } = useSWR(swrKeys.me, authFetcher);
  if (error) {
    if (error.status !== 401) return <Box>Something went wrong...</Box>;
  }
  if (isLoading) {
    return <Box>Loading...</Box>;
  }
  return (
    <>
      <AuthRedirect condition="isLoggedOut" role="Suvlasnik" to="/" />
      <Heading> Ovdje ce biti lista vasih zgrada </Heading>;
    </>
  );
}
