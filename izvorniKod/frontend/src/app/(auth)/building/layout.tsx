import { AuthHeader } from "@/components/shared/AuthHeader/AuthHeader";
import { Flex } from "@chakra-ui/react";

export default function AuthLayout2({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex direction="column" height="100vh">
      <AuthHeader canLogout={true} title={"Unska 2"} />
      <Flex padding="5%">{children}</Flex>
    </Flex>
  );
}
