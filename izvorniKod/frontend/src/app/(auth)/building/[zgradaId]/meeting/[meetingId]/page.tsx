"use client";
import { BackToMeetingListButton } from "@/components/features/BackToMeetingListButton/BackToMeetingListButton";
import { MeetingDisplay } from "@/components/features/MeetingDisplay/MeetingDisplay";
import { AuthHeader } from "@/components/shared/AuthHeader/AuthHeader";
import AuthRedirect from "@/components/shared/AuthRedirect/AuthRedirect";
import { authFetcher } from "@/fetchers/fetcher";
import { IMeeting } from "@/typings/meeting";
import { swrKeys } from "@/typings/swrKeys";
import { Box, Flex } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";

interface IMeetingProps {
  meetingId: string;
  meeting: IMeeting;
}

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.meetingId as string;
  console.log(id);
  const { data, isLoading, error } = useSWR(
    swrKeys.meeting(`${id}`),
    authFetcher<IMeetingProps>
  );
  if (error) {
    console.log(error.message);
    if (error.status !== 401)
      return <Box>No meetings found for the specified building.</Box>;
  }
  if (isLoading || !data) {
    return <Box>Loading...</Box>;
  }
  console.log("DATA", data);
  return (
    <>
      <AuthRedirect to="/" condition="isLoggedOut" role="Administrator" />

      <Flex flexDirection="column" height="100vh">
        <AuthHeader canLogout={true} title=" " />
        <BackToMeetingListButton />
        <MeetingDisplay meeting={data?.meeting} />
      </Flex>
    </>
  );
}
