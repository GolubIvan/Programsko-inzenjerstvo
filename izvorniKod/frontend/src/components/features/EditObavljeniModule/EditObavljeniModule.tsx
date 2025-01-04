import { IMeeting, ITocka } from "@/typings/meeting";
import {
  CardRoot,
  CardTitle,
  Flex,
  Heading,
  CardBody,
  CardDescription,
  Text,
  CardFooter,
} from "@chakra-ui/react";
import { CgCalendarDates, CgPin } from "react-icons/cg";
import { TockaDnevnogReda } from "../TockaDnevnogReda/TockaDnevnogReda";
import { EditableTocka } from "./EditableTocka";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import { swrKeys } from "@/typings/swrKeys";
import { postMutator, putMutator } from "@/fetchers/mutators";

interface IEditObavljeniProps {
  meeting: IMeeting;
}

export function EditObavljeniModule({ meeting }: IEditObavljeniProps) {
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

  const [stanjaTocaka, setStanjaTocaka] = useState(
    meeting.tockeDnevnogReda as Array<ITocka>
  );

  const updateStanjeZakljucka = (
    stanje: "Izglasan" | "Odbijen",
    rbr: number
  ) => {
    let tmpArr = stanjaTocaka;
    let tocka = stanjaTocaka.filter((t) => t.id == rbr)[0];
    console.log(stanje);
    console.log(tocka);
    console.log(tmpArr.at(rbr));
    tocka!.stanjeZakljucka = stanje;
    tmpArr.map((value) => {
      if (value.id == tocka.id) {
        return tocka;
      } else return value;
    });
    setStanjaTocaka([...tmpArr]);
  };

  const updateTekstZakljucka = (tekst: string, rbr: number) => {
    let tmpArr = stanjaTocaka;
    let tocka = stanjaTocaka.filter((t) => t.id == rbr)[0];
    console.log(tekst);
    console.log(tocka);
    console.log(tmpArr.at(rbr));
    tocka!.sazetak = tekst;
    tmpArr.map((value) => {
      if (value.id == tocka.id) {
        return tocka;
      } else return value;
    });
    setStanjaTocaka([...tmpArr]);
  };

  const { trigger } = useSWRMutation(
    swrKeys.updateTocke(`${meeting.meetingId}`),
    putMutator
  );

  const spremiPromjene = async () => {
    let tmpMeeting = meeting;
    tmpMeeting.tockeDnevnogReda = stanjaTocaka;
    console.log({ meetingRequest: tmpMeeting });
    await trigger({ meetingRequest: tmpMeeting });
  };
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
          <Text textAlign="center" color={col} fontWeight="bold">
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
          <EditableTocka
            key={index}
            tocka={tocka}
            rbr={index + 1}
            updateStanjeZakljucka={updateStanjeZakljucka}
            updateTekstZakljucka={updateTekstZakljucka}
          />
        ))}
      </CardBody>
      <CardFooter>
        <Button onClick={spremiPromjene}>Spremi promjene</Button>
      </CardFooter>
    </CardRoot>
  );
}
