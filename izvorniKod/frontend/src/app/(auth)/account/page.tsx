"use client";
import { ChangePasswordForm } from "@/components/features/ChangePasswordForm/ChangePasswordForm";
import AuthRedirect from "@/components/shared/AuthRedirect/AuthRedirect";
import { authFetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { Box } from "@chakra-ui/react";
import useSWR from "swr";

export default function AccountPage() {
  const { data, isLoading, error } = useSWR(swrKeys.me, authFetcher);

  if (error) {
    if (error.status !== 401) return <Box>Something went wrong...</Box>;
    else return <Box>Nemate pristup toj stranici.</Box>;
  }
  if (isLoading || !data) {
    return <Box>Loading...</Box>;
  }
  return (
    <>
      <AuthRedirect to="/" condition="isLoggedOut" role="Administrator" />

      <ChangePasswordForm />
    </>
  );
}
