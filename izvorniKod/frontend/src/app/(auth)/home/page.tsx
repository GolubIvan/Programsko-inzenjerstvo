"use client";
import BuildingListContainer from "@/components/features/BuildingList/BuildingListContainer/BuildingListContainer";
import { authFetcher, fetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { User } from "@/typings/user";
import { Box, Heading } from "@chakra-ui/react";
import useSWR from "swr";

export default function BuildingsListPage() {
  const { data, isLoading, error } = useSWR<User>(swrKeys.me, authFetcher);
  console.log(data);
  if (error) {
    if (error.status !== 401) return <Box>Something went wrong...</Box>;
  }
  if (isLoading || data?.podaci == undefined) {
    return <Box>Loading...</Box>;
  } else {
    console.log(data);
    return (
      <BuildingListContainer podaci={data?.podaci}></BuildingListContainer>
    );
  }
}
