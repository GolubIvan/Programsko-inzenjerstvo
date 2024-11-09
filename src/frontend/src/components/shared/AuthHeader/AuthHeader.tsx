"use client";

import { Flex, Heading, Image, Box, Text } from "@chakra-ui/react";
import logoImage from "../../../../public/logo.png";
import { swrKeys } from "@/typings/swrKeys";
import useSWR from "swr";
import { useRouter } from "next/navigation";

interface IAuthHeaderProps {
  canLogout: boolean;
}

export const AuthHeader = ({ canLogout }: IAuthHeaderProps) => {
  const { mutate } = useSWR(swrKeys.me);
  const router = useRouter();
  const logOut = () => {
    localStorage.setItem("loginInfo", "");
    mutate(null);
    router.push("/");
  };

  return (
    <Box height="15%" width="100%">
      <Flex
        direction="row"
        bg="orange.400"
        height="100%"
        alignItems="center"
        justifyContent="space-between"
        paddingX="40px"
      >
        <Flex
          direction="row"
          justifyContent="space-between"
          height="100%"
          alignItems="center"
          width="30%"
        >
          <Image
            src={logoImage.src}
            alt="Naslovna slika showa"
            objectFit="cover"
            height={"80%"}
          />
          <Heading color="white" fontSize="xx-large">
            eZgrada
          </Heading>
        </Flex>
        {canLogout && (
          <Text color="white" onClick={logOut} cursor="pointer">
            Log out
          </Text>
        )}
      </Flex>
    </Box>
  );
};
