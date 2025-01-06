"use client";
import { LoginForm } from "@/components/features/LoginForm/LoginForm";
import { AuthHeader } from "@/components/shared/AuthHeader/AuthHeader";
import AuthRedirect from "@/components/shared/AuthRedirect/AuthRedirect";
import { authFetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { Card, Flex, Box } from "@chakra-ui/react";
import { Text, Button, Input } from "@chakra-ui/react";
import useSWR from "swr";
export default function LoginPage() {
  //const { data, isLoading, error } = useSWR(swrKeys.me, authFetcher);
  /* if (error) {
    if (error.status !== 401) return <Box>Something went wrong...</Box>;
  }
  if (isLoading) {
    return <Box>Loading...</Box>;
  } */
  //console.log("Ovi podaci", data);
  return (
    <>
      <AuthRedirect to={"/home"} condition={"isLoggedIn"} />
      <Flex height="100vh">
        <Flex direction="column" width="100%" alignItems="center">
          <AuthHeader canLogout={false} />
          <Flex
            height="80%"
            margin="20px"
            width="100%"
            alignItems="center"
            direction="column"
          >
            <LoginForm />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
