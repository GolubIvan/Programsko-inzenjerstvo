import { IMeeting } from "@/typings/meeting";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardTitle,
  Circle,
  Flex,
  Text,
  Icon,
  Box,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CgPin, CgCalendarDates } from "react-icons/cg";
import { BiEdit } from "react-icons/bi";
import useSWRMutation from "swr/mutation";
import { swrKeys } from "@/typings/swrKeys";
import { deleteMutator } from "@/fetchers/mutators";
interface IMeetingSummaryCard {
  role: "Administrator" | "Predstavnik" | "Suvlasnik";
  meeting: IMeeting;
}

export function MeetingSummaryCard({ role, meeting }: IMeetingSummaryCard) {
  const router = useRouter();
  const date = new Date(meeting.vrijeme);
  let col;
  const { trigger } = useSWRMutation(
    swrKeys.deleteMeeting(`${meeting.meetingId}`),
    deleteMutator
  );
  switch (meeting.status) {
    case "Obavljen":
      col = "green";
      break;
    case "Objavljen":
      col = "blue";
      break;
    case "Planiran":
      col = "red";
      break;
    case "Arhiviran":
      col = "yellow";
  }

  const [hovered, setHovered] = useState(false);
  return (
    <>
      <Card.Root
        background={"orange.400"}
        width="300px"
        borderRadius="20px"
        opacity={hovered ? "50%" : "100%"}
      >
        <CardBody
          margin="3%"
          marginBottom="0"
          background={"orange.200"}
          gap="10px"
          borderRadius="15px"
          borderBottomRadius="0"
        >
          <CardTitle
            borderBottom="1px solid black"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Text>{meeting.naslov}</Text>
            {role == "Predstavnik" && (
              <MenuRoot>
                <MenuTrigger asChild>
                  <BiEdit size="25px" />
                </MenuTrigger>
                <MenuContent>
                  <MenuItem
                    value="Uredi"
                    onClick={() => {
                      router.push(
                        `/building/${meeting.zgradaId}/meeting/${meeting.meetingId}`
                      );
                    }}
                  >
                    Uredi
                  </MenuItem>
                  <MenuItem
                    value="Izbrisi"
                    onClick={async () => {
                      console.log(meeting.meetingId);
                      await trigger();
                    }}
                  >
                    Izbriši
                  </MenuItem>
                </MenuContent>
              </MenuRoot>
            )}
          </CardTitle>
          <Box
            onClick={() =>
              router.push(
                `/building/${meeting.zgradaId}/meeting/${meeting.meetingId}`
              )
            }
            onMouseOver={() => {
              setHovered(true);
            }}
            onMouseOut={() => {
              setHovered(false);
            }}
            cursor={hovered ? "pointer" : "default"}
            display="flex"
            flexDir="column"
            gap="10px"
          >
            <CardDescription>{meeting.opis}</CardDescription>

            <Flex direction="column" gap="5%">
              <Flex direction="row" gap="5%" alignItems="center">
                <CgCalendarDates />
                <Text>{date.toLocaleDateString()} </Text>
              </Flex>

              <Flex direction="row" gap="5%" alignItems="center">
                <CgCalendarDates visibility="hidden" />
                <Text>{date.toLocaleTimeString()} </Text>
              </Flex>
            </Flex>
            <Flex direction="row" gap="5%" alignItems="center">
              <CgPin /> {meeting.mjesto}
            </Flex>
          </Box>
        </CardBody>
        <CardFooter
          borderBottomRadius="15px"
          margin="3%"
          marginTop="0"
          background={"orange.200"}
          display="flex"
          flexDir="column"
          alignItems="start"
        >
          <Flex flexDir="row" alignItems="center" gap="5px">
            <Circle background={col} size="15px" />
            <Text textAlign="center">{meeting.status}</Text>
          </Flex>
          {meeting.status == "Objavljen" && (
            <Button>Potvrdite svoj dolazak</Button>
          )}
        </CardFooter>
      </Card.Root>
    </>
  );
}
