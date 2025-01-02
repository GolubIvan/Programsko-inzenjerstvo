"use client";
import { CreateMeetingForm } from "@/components/features/CreateMeetingForm/CreateMeetingForm";
import { MeetingDisplay } from "@/components/features/MeetingDisplay/MeetingDisplay";
import { AuthHeader } from "@/components/shared/AuthHeader/AuthHeader";
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
  return (
    <Flex flexDirection="column" height="100vh">
      <AuthHeader canLogout={true} title=" " />
      <CreateMeetingForm />
    </Flex>
  );
}
