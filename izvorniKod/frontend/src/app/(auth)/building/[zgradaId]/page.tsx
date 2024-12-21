"use client";

import { MeetingSummaryCard } from "@/components/features/MeetingSummaryCard/MeetingSummaryCard";
import { authFetcher } from "@/fetchers/fetcher";
import { IMeeting } from "@/typings/meeting";
import { swrKeys } from "@/typings/swrKeys";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import useSWR from "swr";

interface IMeetingFetch {
  buildingId: Number;
  meetings: IMeeting[];
}

export default function ZgradaPage() {
  const params = useParams();

  let id = params.zgradaId as string;
  const { data, isLoading, error } = useSWR(
    swrKeys.building(`${id}`),
    authFetcher<IMeetingFetch>
  );
  if (error) {
    console.log(error.message);
    if (error.status !== 401)
      return <Box>No meetings found for the specified building.</Box>;
  }
  if (isLoading) {
    return <Box>Loading...</Box>;
  }
  console.log("DATA", data);
  return (
    <Flex direction="row" gap="5%" width="100%">
      {data?.meetings.map((meeting, ind) => {
        return <MeetingSummaryCard key={ind} meeting={meeting} />;
      })}
    </Flex>
  );
}
