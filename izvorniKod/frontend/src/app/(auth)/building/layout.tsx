import { AuthHeader } from "@/components/shared/AuthHeader/AuthHeader";
import { Flex } from "@chakra-ui/react";
import { createContext } from "react";

interface IAddressProvider {
  address: string;
}

export default function AuthLayout2({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
