"use client";
import { BackToMeetingListButton } from "@/components/features/BackToMeetingListButton/BackToMeetingListButton";
import { CreateMeetingForm } from "@/components/features/CreateMeetingForm/CreateMeetingForm";
import { EditObavljeniModule } from "@/components/features/EditObavljeniModule/EditObavljeniModule";
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

export default function EditMeetingPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.meetingId as string;
  const { data, isLoading, error } = useSWR(
    swrKeys.meeting(`${id}`),
    authFetcher<IMeetingProps>
  );
  if (error) {
    if (error.status !== 401)
      return <Box>No meetings found for the specified building.</Box>;
    else return <Box>Nemate pristup toj stranici.</Box>;
  }
  if (isLoading || !data) {
    return <Box>Loading...</Box>;
  }
  return (
    <>
      <AuthRedirect to="/" condition="isLoggedOut" role="Administrator" />

      <Flex flexDirection="column" height="100vh">
        <AuthHeader canLogout={true} title=" " />
        <BackToMeetingListButton />
        {data.meeting.status == "Planiran" && (
          <CreateMeetingForm meeting={data.meeting} />
        )}
        {data.meeting.status == "Obavljen" && (
          <EditObavljeniModule meeting={data.meeting} />
        )}
      </Flex>
    </>
  );
}
