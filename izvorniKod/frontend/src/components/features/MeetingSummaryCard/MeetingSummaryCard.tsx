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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CgPin, CgCalendarDates } from "react-icons/cg";
import { cursorTo } from "readline";

interface IMeetingSummaryCard {
  meeting: IMeeting;
}

export function MeetingSummaryCard({ meeting }: IMeetingSummaryCard) {
  const router = useRouter();
  const date = new Date(meeting.vrijeme);
  let col;
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
    <Card.Root
      background={"orange.400"}
      width="300px"
      borderRadius="20px"
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
      opacity={hovered ? "50%" : "100%"}
      cursor={hovered ? "pointer" : "default"}
    >
      <CardBody
        margin="3%"
        marginBottom="0"
        background={"orange.200"}
        gap="5px"
        borderRadius="15px"
        borderBottomRadius="0"
      >
        <CardTitle borderBottom="1px solid black">{meeting.naslov}</CardTitle>
        <CardDescription>{meeting.opis}</CardDescription>
        <CardDescription></CardDescription>

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
      </CardBody>
      <CardFooter
        borderBottomRadius="15px"
        dir="row"
        margin="3%"
        marginTop="0"
        background={"orange.200"}
      >
        <Circle background={col} size="15px" />
        <Text textAlign="center">{meeting.status}</Text>
      </CardFooter>
    </Card.Root>
  );
}
