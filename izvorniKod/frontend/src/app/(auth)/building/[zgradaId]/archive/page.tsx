"use client";

import { MeetingSummaryCard } from "@/components/features/MeetingSummaryCard/MeetingSummaryCard";
import { AuthHeader } from "@/components/shared/AuthHeader/AuthHeader";
import AuthRedirect from "@/components/shared/AuthRedirect/AuthRedirect";
import { authFetcher } from "@/fetchers/fetcher";
import { IMeeting } from "@/typings/meeting";
import { swrKeys } from "@/typings/swrKeys";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { Router } from "next/router";
import useSWR from "swr";

interface IMeetingFetch {
  buildingId: number;
  address: string;
  role: "Administrator" | "Predstavnik" | "Suvlasnik";
  meetings: Array<IMeeting>;
}

export default function ZgradaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.zgradaId as string;
  const { data, isLoading, error } = useSWR(
    swrKeys.building(`${id}`),
    authFetcher<IMeetingFetch>
  );
  if (error) {
    if (error.status !== 401)
      return <Box>No meetings found for the specified building.</Box>;
    else return <Box>Nemate pristup toj stranici.</Box>;
  }
  if (isLoading || !data) {
    return <Box>Loading...</Box>;
  }

  const returnFunction = function () {
    router.push("./");
  };

  const archivedMeetings = data?.meetings.filter(
    (meeting: IMeeting) => meeting.status == "Arhiviran"
  );

  return (
    <>
      <AuthRedirect to="/" condition="isLoggedOut" role="Administrator" />
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
                onClick={returnFunction}
              >
                Povratak na popis sastanaka
              </Button>
            </Flex>
            <Heading fontSize="2rem">Vaši arhivirani sastanci...</Heading>
            <Flex
              direction={{ base: "column", md: "row" }}
              width="100%"
              gap="15px"
              alignItems={{ base: "center", md: "flex-start" }}
              flexWrap="wrap"
            >
              {archivedMeetings?.length != 0 &&
                data?.meetings.map((meeting, ind) => {
                  if (meeting.status == "Arhiviran")
                    return (
                      <MeetingSummaryCard
                        key={ind}
                        meeting={meeting}
                        role={data.role}
                      />
                    );
                })}
              {archivedMeetings?.length == 0 && (
                <Text>Još nema arhiviranih sastanaka za ovu zgradu.</Text>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
