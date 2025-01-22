"use client";
import { HomeHeader } from "@/components/features/HomeHeader/HomeHeader";
import { Button } from "@/components/ui/button";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Flex direction="column" height="100vh" gap="30px">
        <Box width="100%" height="15%">
          <HomeHeader />
        </Box>
        <Flex
          gap="30px"
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading textAlign="center" fontSize={{ base: "4xl", md: "5xl" }}>
            Vlasnik ste stambenog objekta?
          </Heading>
          <Heading textAlign="center" fontSize={{ base: "3xl", md: "4xl" }}>
            Želite svojim sustanarima nešto poručiti?
          </Heading>
          <Heading
            textAlign="center"
            marginTop="40px"
            fontSize={{ base: "2xl", md: "3xl" }}
          >
            Sada brže i lakše nego ikada...
          </Heading>
          <Button
            onClick={() => router.push("/login")}
            size="2xl"
            width="200px"
            height="60px"
            bg="orange"
          >
            Započnite sada
          </Button>
        </Flex>
      </Flex>
    </>
  );
}
