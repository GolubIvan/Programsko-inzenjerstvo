import { Header } from "@/components/shared/Header/Header";
import { Flex } from "@chakra-ui/react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Flex direction="column" height="100vh">
      <Header buildingAddress="Majstora radovana 10" />
      {children}
    </Flex>
  );
}
