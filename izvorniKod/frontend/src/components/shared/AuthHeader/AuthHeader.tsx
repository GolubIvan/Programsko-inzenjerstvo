"use client";

import { Flex, Heading, Image, Text, IconButton } from "@chakra-ui/react";
import logoImage from "../../../../public/logo.png";
import { swrKeys } from "@/typings/swrKeys";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";
import { LuLock, LuPen } from "react-icons/lu";
import Link from "next/link";
import { authFetcher } from "@/fetchers/fetcher";
import { User } from "@/typings/user";

interface IAuthHeaderProps {
  canLogout: boolean;
  title?: string;
  username?: string;
}

export const AuthHeader = ({
  canLogout,
  title,
  username,
}: IAuthHeaderProps) => {
  const { data } = useSWR(swrKeys.me, authFetcher<User>);
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const logOut = async () => {
    localStorage.setItem("loginInfo", "");
    await mutate(swrKeys.me, null);
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
        <Link href="/home">
          <Image src={logoImage.src} alt="Naslovna slika showa" height="80px" />
        </Link>

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
          {data && data.email && (
            <Text color="white">{`Pozdrav, ${data?.email}`}</Text>
          )}
          <IconButton
            background="transparent"
            color="white"
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
