"use client";
import { LoginForm } from "@/components/features/LoginForm/LoginForm";
import { AuthHeader } from "@/components/shared/AuthHeader/AuthHeader";
import AuthRedirect from "@/components/shared/AuthRedirect/AuthRedirect";
import { Flex } from "@chakra-ui/react";
export default function LoginPage() {
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
