"use client";

import { CreateForm } from "@/components/features/CreateForm/CreateForm";
import AuthRedirect from "@/components/shared/AuthRedirect/AuthRedirect";
import { authFetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { Box, Flex } from "@chakra-ui/react";
import useSWR from "swr";

export default function CreatePage() {
  const { data, isLoading, error } = useSWR(swrKeys.me, authFetcher);
  if (error) {
    if (error.status !== 401) return <Box>Something went wrong...</Box>;
  }
  if (isLoading) {
    return <Box>Loading...</Box>;
  }
  return (
    <>
      <AuthRedirect to="/" condition="isLoggedOut" role="Administrator" />
      <AuthRedirect to="/home" condition="isLoggedIn" role="Predstavnik" />
      <AuthRedirect to="/home" condition="isLoggedIn" role="Suvlasnik" />
      <Flex margin="auto" width="50%" marginTop="50px">
        <CreateForm />
      </Flex>
    </>
  );
}
