"use client";
import { authFetcher, fetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { Podaci, Zgrada } from "@/typings/user";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import useSWR from "swr";

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
    <Flex direction="column">
      {podaci.map((podatak: Podaci, key) => {
        return (
          <Text key={key}>
            {podatak.zgrada.address +
              " na ovom mestu " +
              podatak.zgrada.zgradaId +
              " ovaj id " +
              podatak.uloga}
          </Text>
        );
      })}
    </Flex>
  );
}
