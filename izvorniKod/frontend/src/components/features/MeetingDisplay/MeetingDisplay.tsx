import { IMeeting } from "@/typings/meeting";
import {
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
  Circle,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { TockaDnevnogReda } from "../TockaDnevnogReda/TockaDnevnogReda";
import { CgCalendarDates, CgPin } from "react-icons/cg";

interface IMeetingProps {
  meeting: IMeeting;
}

export function MeetingDisplay({ meeting }: IMeetingProps) {
  const date = new Date(meeting.vrijeme);
  let col = "";
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
  return (
    <CardRoot margin="3%" marginBottom="0" padding="10px">
      <CardTitle borderBottom="1px solid black">
        <Flex flexDirection="row" alignItems="center">
          <Heading>{meeting.naslov} </Heading>
        </Flex>
      </CardTitle>
      <CardBody>
        <Heading
          display="flex"
          alignItems="center"
          alignContent="center"
          flexDirection="row"
          gap="10px"
        >
          Status sastanka:
          <Text
            textAlign="center"
            color={col}
            fontWeight="bold"
            bg={meeting.status == "Arhiviran" ? "gray.700" : "white"}
          >
            {meeting.status}
          </Text>
        </Heading>
      </CardBody>
      <CardBody>
        <Heading>Sažetak:</Heading>
        <CardDescription fontSize="1rem">{meeting.sazetak}</CardDescription>
      </CardBody>
      <CardBody>
        <Heading>Vrijeme i mjesto:</Heading>
        <Flex direction="column" gap="5%">
          <Flex direction="row" gap="5px" alignItems="center">
            <CgCalendarDates />
            <Text>{date.toLocaleDateString()} </Text>
            <Text>{date.toLocaleTimeString()} </Text>
          </Flex>
        </Flex>
        <Flex direction="row" gap="5px" alignItems="center">
          <CgPin /> {meeting.mjesto}
        </Flex>
      </CardBody>

      <CardBody gap="10px">
        <Heading>{"Točke dnevnog reda:"}</Heading>
        {meeting.tockeDnevnogReda.map((tocka, index) => (
          <TockaDnevnogReda key={index} tocka={tocka} rbr={index + 1} />
        ))}
      </CardBody>
    </CardRoot>
  );
}
