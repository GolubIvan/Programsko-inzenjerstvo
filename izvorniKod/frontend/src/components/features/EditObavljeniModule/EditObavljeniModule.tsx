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
import { EditableTocka } from "./EditableTocka";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { swrKeys } from "@/typings/swrKeys";
import { putMutator } from "@/fetchers/mutators";
import { useParams, useRouter } from "next/navigation";

interface IEditObavljeniProps {
  meeting: IMeeting;
}

export function EditObavljeniModule({ meeting }: IEditObavljeniProps) {
  const router = useRouter();
  const params = useParams();
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
    const tmpArr = stanjaTocaka;
    const tocka = stanjaTocaka.filter((t) => t.id == rbr)[0];
    tocka!.stanjeZakljucka = stanje;
    tmpArr.map((value) => {
      if (value.id == tocka.id) {
        return tocka;
      } else return value;
    });
    setStanjaTocaka([...tmpArr]);
  };

  const updateTekstZakljucka = (tekst: string, rbr: number) => {
    const tmpArr = stanjaTocaka;
    const tocka = stanjaTocaka.filter((t) => t.id == rbr)[0];
    tocka!.sazetak = tekst;
    tmpArr.map((value) => {
      if (value.id == tocka.id) {
        return tocka;
      } else return value;
    });
    setStanjaTocaka([...tmpArr]);
  };

  const { trigger } = useSWRMutation(
    swrKeys.updateMeeting(`${meeting.meetingId}`),
    putMutator,
    {
      onSuccess: () => {
        router.push(`/building/${Number(params.zgradaId)}`);
      },
    }
  );

  const spremiPromjene = async () => {
    const tmpMeeting = meeting;
    tmpMeeting.tockeDnevnogReda = stanjaTocaka;
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
