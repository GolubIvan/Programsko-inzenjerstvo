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
import { CgPin, CgCalendarDates, CgUsbC, CgUser } from "react-icons/cg";
import { BiEdit } from "react-icons/bi";
import useSWRMutation from "swr/mutation";
import { swrKeys } from "@/typings/swrKeys";
import { deleteMutator, postMutator } from "@/fetchers/mutators";
import useSWR, { useSWRConfig } from "swr";
import { IMeetingFetch } from "@/app/(auth)/building/[zgradaId]/page";
import MeetingPage from "@/app/(auth)/building/[zgradaId]/create/page";
interface IMeetingSummaryCard {
  role: "Administrator" | "Predstavnik" | "Suvlasnik";
  meeting: IMeeting;
}

export function MeetingSummaryCard({ role, meeting }: IMeetingSummaryCard) {
  const router = useRouter();
  const date = new Date(meeting.vrijeme);
  let col;
  const { mutate } = useSWRConfig();
  const { trigger } = useSWRMutation(
    swrKeys.deleteMeeting(`${meeting.meetingId}`),
    deleteMutator,
    {
      onSuccess: async (data) => {
        await mutate(swrKeys.building(`${meeting.zgradaId}`));
      },
    }
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

  let dolaznost_tekst;
  if (meeting.status == "Objavljen") {
    if (meeting.brojSudionika == 0)
      dolaznost_tekst = "Još nema potvrđenih dolazaka.";
    else {
      if (meeting.brojSudionika % 10 == 1)
        dolaznost_tekst = `${meeting.brojSudionika} sudionik dolazi`;
      else dolaznost_tekst = `${meeting.brojSudionika} sudionika dolaze`;
    }
  }
  if (meeting.status == "Obavljen" || meeting.status == "Arhiviran") {
    if (meeting.brojSudionika == 0) dolaznost_tekst = "Nije bilo sudionika.";
    else {
      if (meeting.brojSudionika % 10 == 1)
        dolaznost_tekst = `${meeting.brojSudionika} sudionik`;
      else dolaznost_tekst = `${meeting.brojSudionika} sudionika`;
    }
  }

  const [hovered, setHovered] = useState(false);

  const { trigger: trigger_objavi } = useSWRMutation(
    swrKeys.objaviMeeting(`${meeting.meetingId}`),
    postMutator,
    {
      onSuccess: async (data) => {
        await mutate(swrKeys.building(`${meeting.zgradaId}`));
      },
    }
  );

  const { trigger: trigger_arhiviraj } = useSWRMutation(
    swrKeys.arhivirajMeeting(`${meeting.meetingId}`),
    postMutator,
    {
      onSuccess: async (data) => {
        await mutate(swrKeys.building(`${meeting.zgradaId}`));
      },
    }
  );
  const { trigger: trigger_join = trigger } = useSWRMutation(
    swrKeys.joinMeeting(`${meeting.meetingId}`),
    postMutator,
    {
      onSuccess: async (data) => {
        await mutate(swrKeys.building(`${meeting.zgradaId}`));
      },
    }
  );

  const { trigger: trigger_leave = trigger } = useSWRMutation(
    swrKeys.leaveMeeting(`${meeting.meetingId}`),
    postMutator,
    {
      onSuccess: async (data) => {
        await mutate(swrKeys.building(`${meeting.zgradaId}`));
      },
    }
  );

  const [obavljenError, setObavljenError] = useState("");
  const [arhiviranError, setArhiviranError] = useState("");

  const { trigger: trigger_obavi = trigger } = useSWRMutation(
    swrKeys.obaviMeeting(`${meeting.meetingId}`),
    postMutator,
    {
      onSuccess: async (data) => {
        await mutate(swrKeys.building(`${meeting.zgradaId}`));
      },
      onError: async (err) => {
        setObavljenError(err.message);
      },
    }
  );

  return (
    <>
      <Card.Root
        background={"orange.400"}
        width="300px"
        borderRadius="20px"
        opacity={hovered ? "50%" : "100%"}
        color="black"
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
                  {(meeting.status == "Planiran" ||
                    meeting.status == "Obavljen") && (
                    <MenuItem
                      value="Uredi"
                      onClick={() => {
                        router.push(
                          `/building/${meeting.zgradaId}/meeting/${meeting.meetingId}/edit`
                        );
                      }}
                    >
                      Uredi
                    </MenuItem>
                  )}
                  {meeting.status == "Planiran" && (
                    <>
                      <MenuItem
                        value="Izbrisi"
                        onClick={async () => {
                          await trigger();
                        }}
                      >
                        Izbriši
                      </MenuItem>
                      <MenuItem
                        value="Objavi"
                        onClick={async () => {
                          await trigger_objavi();
                        }}
                      >
                        Objavi
                      </MenuItem>
                    </>
                  )}
                  {meeting.status == "Objavljen" && (
                    <MenuItem
                      value="Obavi"
                      onClick={async () => {
                        const now = new Date();
                        if (now < date) {
                          setObavljenError(
                            "Nije moguće prebaciti sastanak u stanje 'Obavljen' prije isteka vremena."
                          );
                          return;
                        }
                        await trigger_obavi();
                      }}
                    >
                      {'Označi kao "Obavljen"'}
                    </MenuItem>
                  )}
                  {meeting.status == "Obavljen" && (
                    <MenuItem
                      value="Arhiviraj"
                      onClick={async () => {
                        for (
                          let i = 0;
                          i < meeting.tockeDnevnogReda.length;
                          i++
                        ) {
                          if (
                            meeting.tockeDnevnogReda[i].imaPravniUcinak &&
                            !meeting.tockeDnevnogReda[i].sazetak
                          ) {
                            setArhiviranError(
                              "Sve točke dnevnog reda s pravnim učinkom moraju imati zaključak"
                            );
                            return;
                          } else if (
                            meeting.tockeDnevnogReda[i].imaPravniUcinak &&
                            !meeting.tockeDnevnogReda[i].stanjeZakljucka
                          ) {
                            setArhiviranError(
                              "Sve točke dnevnog reda s pravnim učinkom moraju imati status zaključka kao Izglasan ili Odbijen"
                            );
                            return;
                          }
                        }
                        await trigger_arhiviraj();
                      }}
                    >
                      Arhiviraj
                    </MenuItem>
                  )}
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
            <CardDescription color="black">{meeting.sazetak}</CardDescription>

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
            {meeting.status != "Planiran" && (
              <Flex direction="row" gap="5%" alignItems="center">
                <CgUser /> {dolaznost_tekst}
              </Flex>
            )}
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
          {meeting.status == "Objavljen" && meeting.sudjelovanje && (
            <Button
              onClick={async () => {
                await trigger_leave();
              }}
            >
              Otkažite svoj dolazak
            </Button>
          )}
          {meeting.status == "Objavljen" && !meeting.sudjelovanje && (
            <Button
              onClick={async () => {
                await trigger_join();
              }}
            >
              Potvrdite svoj dolazak
            </Button>
          )}
          {obavljenError != "" && <Text color="red">{obavljenError}</Text>}
          {arhiviranError != "" && <Text color="Red">{arhiviranError}</Text>}
        </CardFooter>
      </Card.Root>
    </>
  );
}
