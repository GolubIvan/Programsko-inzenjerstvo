
import { Flex } from "@chakra-ui/react";

export default function AuthLayout2({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex direction="column" height="100vh">
      {children}
    </Flex>
  );
}
