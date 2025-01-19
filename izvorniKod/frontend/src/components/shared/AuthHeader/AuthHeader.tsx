"use client";

import {
  Flex,
  Heading,
  Image,
  Box,
  Text,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import logoImage from "../../../../public/logo.png";
import { swrKeys } from "@/typings/swrKeys";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import { LuLock, LuPen } from "react-icons/lu";

interface IAuthHeaderProps {
  canLogout: boolean;
  title?: string;
}

export const AuthHeader = ({ canLogout, title }: IAuthHeaderProps) => {
  const { mutate } = useSWR(swrKeys.me);
  const router = useRouter();
  const logOut = async () => {
    localStorage.setItem("loginInfo", "");
    await mutate(null);
    router.push("/");
  };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      height="150px"
      bg="orange.400"
      alignItems="center"
      justifyContent="space-between"
      padding={{ base: "20px", md: "40px" }}
      width="100%"
    >
      <Flex
        direction="row"
        alignItems="center"
        gap={
          canLogout ? { base: "20%", md: "40%" } : { base: "30%", md: "50%" }
        }
        width={{ base: "100%", md: "80%" }}
      >
        <Image src={logoImage.src} alt="Naslovna slika showa" height="80px" />

        {title && (
          <Heading color="white" fontSize="xx-large">
            {title}
          </Heading>
        )}
        {!title && (
          <Heading color="white" fontSize="xx-large">
            eZgrada
          </Heading>
        )}
      </Flex>
      {canLogout && (
        <Flex alignItems="center" gap="20px">
          <IconButton
            background="transparent"
            onClick={() => {
              router.push("/account");
            }}
          >
            <Flex gap="0">
              <LuLock />
              <LuPen />
            </Flex>
          </IconButton>

          <Text
            color="white"
            onClick={logOut}
            cursor="pointer"
            fontSize="large"
          >
            Log out
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
