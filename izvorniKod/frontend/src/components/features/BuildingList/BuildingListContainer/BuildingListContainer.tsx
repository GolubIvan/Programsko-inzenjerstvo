"use client";
import { authFetcher, fetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { Podaci, Zgrada } from "@/typings/user";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import useSWR from "swr";
import { BuildingListCard } from "../../BuildingListCard/BuildingListCard";

interface IBuildingListContainerProps {
  podaci: Podaci[];
}

export default function BuildingListContainer({
  podaci: podaci,
}: IBuildingListContainerProps) {
  podaci.map((podatak: Podaci) => {
    console.log(podatak);
  });
  return (
    <Flex direction="column" h="80%">
      <Text
        width={"60%"}
        fontSize="x-large"
        fontWeight="600"
        alignSelf="center"
        m="10px"
      >
        Vaši stambeni objekti
      </Text>
      <Flex
        direction="column"
        alignSelf={"center"}
        width={"80%"}
        alignItems={"center"}
        overflowY="scroll"
      >
        {podaci.map((podatak: Podaci, key) => {
          return <BuildingListCard podatak={podatak} key={key} />;
        })}
      </Flex>
    </Flex>
  );
}
