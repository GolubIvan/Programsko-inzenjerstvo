import { Flex } from "@chakra-ui/react";
import { AuthHeader } from "@/components/shared/AuthHeader/AuthHeader";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex direction="column" height="100vh">
      <AuthHeader canLogout={true} />
      {children}
    </Flex>
  );
}
