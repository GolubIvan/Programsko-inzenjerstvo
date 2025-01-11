"use client";
import BuildingListContainer from "@/components/features/BuildingList/BuildingListContainer/BuildingListContainer";
import { ChangePasswordForm } from "@/components/features/ChangePasswordForm/ChangePasswordForm";
import { authFetcher } from "@/fetchers/fetcher";
import { swrKeys } from "@/typings/swrKeys";
import { User } from "@/typings/user";
import { Box, Heading } from "@chakra-ui/react";
import useSWR from "swr";

export default function AccountPage() {
  return <ChangePasswordForm></ChangePasswordForm>;
}
