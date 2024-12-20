"use client";
import { authFetcher, fetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { Box, Heading } from "@chakra-ui/react";
import useSWR from "swr";

export default function BuildingsListPage() {
  const { data, isLoading, error } = useSWR(swrKeys.me, authFetcher);
  if (error) {
    if (error.status !== 401) return <Box>Something went wrong...</Box>;
  }
  if (isLoading) {
    return <Box>Loading...</Box>;
  } else {
    console.log(data);
    return <Heading> Ovdje ce biti lista vasih zgrada </Heading>;
  }
}
