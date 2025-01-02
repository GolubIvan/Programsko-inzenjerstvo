"use client";

import { MeetingSummaryCard } from "@/components/features/MeetingSummaryCard/MeetingSummaryCard";
import { AuthHeader } from "@/components/shared/AuthHeader/AuthHeader";
import { authFetcher } from "@/fetchers/fetcher";
import { deleteMutator } from "@/fetchers/mutators";
import { IMeeting } from "@/typings/meeting";
import { swrKeys } from "@/typings/swrKeys";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { Router } from "next/router";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export interface IMeetingFetch {
  buildingId: Number;
  address: string;
  role: "Administrator" | "Predstavnik" | "Suvlasnik";
  meetings: Array<IMeeting>;
}

export default function ZgradaPage() {
  const params = useParams();
  const router = useRouter();
  let id = params.zgradaId as string;
  const { data, isLoading, error, mutate } = useSWR(
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
  console.log(data?.meetings.length);
  console.log("DATA", data);

  const activeMeetings = data?.meetings.filter(
    (meeting: IMeeting) => meeting.status != "Arhiviran"
  );
  const deleteMeeting = (id: string) => {};
  return (
    <Flex direction="column" height="100vh">
      <AuthHeader canLogout={true} title={data?.address} />
      <Flex padding="5%" paddingTop="2vh">
        <Flex direction="column" width="100%" paddingTop="0" gap="10px">
          <Flex
            direction="row"
            justifyContent="space-between"
            marginBottom="5vh"
            gap="10px"
            wrap="wrap"
          >
            <Button
              background="gray.300"
              color="black"
              onClick={() => router.push("../home")}
            >
              Povratak na popis zgrada
            </Button>
            <Flex direction="row" gap="5px" flexWrap="wrap">
              {data?.role == "Predstavnik" && (
                <Button
                  background="gray.300"
                  color="black"
                  onClick={() => router.push(`/building/${id}/create`)}
                >
                  + Kreirajte novi sastanak
                </Button>
              )}
              <Button
                background="gray.300"
                color="black"
                onClick={() => router.push(id + "/archive")}
              >
                Arhiva sastanaka
              </Button>
            </Flex>
          </Flex>
          <Heading fontSize="2rem">Vaši aktivni sastanci...</Heading>
          <Flex direction="row" gap="5%" width="100%" flexWrap="wrap">
            {activeMeetings?.length != 0 &&
              data?.meetings.map((meeting, ind) => {
                return (
                  <MeetingSummaryCard
                    key={ind}
                    meeting={meeting}
                    role={data.role}
                  />
                );
              })}
            {activeMeetings?.length == 0 && (
              <Text>Još nema sastanaka za ovu zgradu.</Text>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
