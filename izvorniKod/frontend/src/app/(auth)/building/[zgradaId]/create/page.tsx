"use client";
import { BackToMeetingListButton } from "@/components/features/BackToMeetingListButton/BackToMeetingListButton";
import { CreateMeetingForm } from "@/components/features/CreateMeetingForm/CreateMeetingForm";
import { AuthHeader } from "@/components/shared/AuthHeader/AuthHeader";
import AuthRedirect from "@/components/shared/AuthRedirect/AuthRedirect";
import { Flex } from "@chakra-ui/react";
import { useParams } from "next/navigation";

export default function MeetingPage() {
  const params = useParams();
  return (
    <>
      <AuthRedirect to="/" condition="isLoggedOut" role="Administrator" />
      <Flex flexDirection="column" height="100vh">
        <AuthHeader canLogout={true} title=" " />
        <BackToMeetingListButton />
        <CreateMeetingForm />
      </Flex>
    </>
  );
}
