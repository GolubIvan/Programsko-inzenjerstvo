import { IMeeting, ITocka } from "@/typings/meeting";
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
  CardRoot,
  Heading,
  Input,
  IconButton,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CgPin, CgCalendarDates } from "react-icons/cg";
import { BiChevronLeft, BiEdit } from "react-icons/bi";
import { TockaDnevnogReda } from "../TockaDnevnogReda/TockaDnevnogReda";
import { useForm } from "react-hook-form";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox";
import { swrKeys } from "@/typings/swrKeys";
import { createMutator, putMutator } from "@/fetchers/mutators";
import useSWRMutation from "swr/mutation";
import { BackToMeetingListButton } from "../BackToMeetingListButton/BackToMeetingListButton";
import { LuSearch } from "react-icons/lu";
import { authFetcher } from "@/fetchers/fetcher";
import { Discussion } from "@/typings/discussion";
import { mockComponent } from "react-dom/test-utils";
import { DiSublime } from "react-icons/di";

interface IMeetingForm {
  naslov: string;
  mjesto: string;
  vrijeme: Date;
  status: "Obavljen" | "Objavljen" | "Planiran" | "Arhiviran";
  zgradaId: number;
  sazetak: string;
  tockeDnevnogReda: ITockaForm[];
}

interface ITockaForm {
  imeTocke: string;
  imaPravniUcinak: boolean;
  sazetak?: string;
  stanjeZakljucka?: "Izglasan";
  url?: string;
}

interface ICreateMeetingFormProps {
  meeting?: IMeeting;
}

export function CreateMeetingForm({ meeting }: ICreateMeetingFormProps) {
  const tockaUrl = useRef<HTMLInputElement>(null);
  const tockaIme = useRef<HTMLInputElement>(null);
  const tockaBool = useRef<HTMLInputElement>(null);
  const kljucnaRijecIme = useRef<HTMLInputElement>(null);
  const params = useParams();
  const router = useRouter();

  const [newMeeting, setNewMeeting] = useState<IMeetingForm>({
    naslov: meeting ? meeting.naslov : "",
    mjesto: meeting ? meeting.mjesto : "",
    vrijeme: meeting ? meeting.vrijeme : new Date(),
    sazetak: meeting ? meeting.sazetak : "",
    zgradaId: meeting ? meeting.zgradaId : Number(params.zgradaId),
    status: meeting ? meeting.status : "Planiran",
    tockeDnevnogReda: meeting
      ? meeting.tockeDnevnogReda.map((tocka, index) => {
          return {
            imeTocke: tocka.imeTocke,
            imaPravniUcinak: tocka.imaPravniUcinak,
            url: tocka.url,
          };
        })
      : [],
  });
  const [newTocka, setNewTocka] = useState<ITockaForm>({
    imeTocke: "",
    imaPravniUcinak: false,
    sazetak: undefined,
    url: "",
    stanjeZakljucka: undefined,
  });
  const [discussionList, setDiscussionList] = useState<Array<Discussion>>();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<IMeetingForm>({
    defaultValues: newMeeting,
  });
  setValue("status", "Planiran");
  setValue("zgradaId", newMeeting.zgradaId);
  const dodajTocku = (data: ITockaForm) => {
    if (data.imeTocke == "") {
      setError("root", { message: "Ime točke je obavezno" });
      return;
    }
    setError("root", { message: "" });
    const tock = { ...data };
    setNewMeeting((prev) => ({
      ...prev,
      tockeDnevnogReda: [...prev.tockeDnevnogReda, tock],
    }));
    if (tockaUrl.current != null) {
      tockaUrl.current.value = "";
    }
    if (tockaIme.current != null) {
      tockaIme.current.value = "";
    }
    if (tockaBool.current != null && tockaBool.current.checked) {
      tockaBool.current.click();
    }
    setNewTocka({
      imeTocke: "",
      imaPravniUcinak: false,
      sazetak: undefined,
      url: "",
      stanjeZakljucka: undefined,
    });
  };
  const izbrisiTocku = (rbr: number) => {
    let temp = newMeeting.tockeDnevnogReda;
    temp.splice(rbr - 1, 1);
    console.log(temp);
    setNewMeeting((prev) => ({
      ...prev,
      tockeDnevnogReda: temp,
    }));
  };
  useEffect(() => {
    console.log(newMeeting); // This will log the updated state
    setValue("tockeDnevnogReda", newMeeting.tockeDnevnogReda);
  }, [newMeeting, discussionList]);
  const createForm = async (data: IMeetingForm) => {
    console.log("lol");
    if (data.tockeDnevnogReda.length == 0) {
      setError("root", {
        message: "Potrebno je dodati barem jednu točku dnevnoga reda",
      });
      return;
    }
    if (meeting) {
      const temp = meeting;
      temp.naslov = data.naslov;
      temp.vrijeme = data.vrijeme;
      temp.mjesto = data.mjesto;
      temp.sazetak = data.sazetak;
      temp.tockeDnevnogReda = data.tockeDnevnogReda.map((tocka) => {
        return {
          id: 0,
          sastanakId: meeting.meetingId,
          imeTocke: tocka.imeTocke,
          imaPravniUcinak: tocka.imaPravniUcinak,
          url: tocka.url,
        };
      });
      await trigger2({ meetingRequest: temp });
    } else await trigger(data);
  };

  const { trigger } = useSWRMutation(swrKeys.createMeeting, createMutator, {
    onSuccess: async (data) => {
      console.log(data);
      reset();
      router.push(`/building/${params.zgradaId}`);
    },
  });
  const { trigger: trigger2 } = useSWRMutation(
    swrKeys.updateMeeting(`${meeting?.meetingId}`),
    putMutator,
    {
      onSuccess: async (data) => {
        console.log(data);
        reset();
        router.push(`/building/${params.zgradaId}`);
      },
    }
  );
  const onSelectKeyword = async (keyword?: string) => {
    if (!keyword || keyword == "") {
      if (kljucnaRijecIme.current)
        kljucnaRijecIme.current.style.borderColor = "red";
      return;
    } else {
      if (kljucnaRijecIme.current)
        kljucnaRijecIme.current.style.borderColor = "";
    }
    console.log("Keyword", keyword);
    console.log(swrKeys.getDiscussion(`${params.zgradaId}`, `${keyword}`));
    try {
      const data = await authFetcher<Array<Discussion>>(
        swrKeys.getDiscussion(`${params.zgradaId}`, `${keyword}`),
        {
          method: "GET",
        }
      );
      setDiscussionList(Object.values(data));
    } catch (err) {
      setDiscussionList([]);
    }
  };
  return (
    <>
      <CardRoot
        margin="3%"
        marginBottom="0"
        padding="10px"
        as="form"
        onSubmit={handleSubmit(createForm)}
      >
        <CardTitle borderBottom="1px solid black">
          <Flex flexDirection="row" alignItems="center">
            <Input
              type="text"
              placeholder="Naslov sastanka"
              {...register("naslov", {
                required: "Naslov sastanka je obavezan",
              })}
              size="2xl"
            />
          </Flex>
          {errors.naslov?.message && (
            <Text color="red" fontSize="xl">
              {errors.naslov.message}
            </Text>
          )}
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
            <Text textAlign="center" color={"red"} fontWeight="bold">
              {newMeeting.status}
            </Text>
          </Heading>
        </CardBody>
        <CardBody>
          <Heading>Vrijeme i mjesto:</Heading>
          <Flex direction="column" gap="5%">
            <Flex direction="row" gap="5px" alignItems="center">
              <CgCalendarDates />
              <Input
                type="datetime-local"
                width="200px"
                size="lg"
                {...register("vrijeme", {
                  required: "Vrijeme sastanka je obavezno",
                })}
              />
            </Flex>
          </Flex>
          {errors.vrijeme?.message && (
            <Text color="red" fontSize="lg">
              {errors.vrijeme.message}
            </Text>
          )}
          <Flex direction="row" gap="5px" alignItems="center">
            <CgPin />{" "}
            <Input
              placeholder="Mjesto"
              {...register("mjesto", {
                required: "Mjesto sastanka je obavezno",
              })}
              width="200px"
            />
          </Flex>
          {errors.mjesto?.message && (
            <Text color="red" fontSize="lg">
              {errors.mjesto.message}
            </Text>
          )}
        </CardBody>
        <CardBody>
          <Heading>Sažetak:</Heading>
          <CardDescription fontSize="1rem">
            <Input
              type="text"
              placeholder="Sažetak sastanka"
              {...register("sazetak", {
                required: "Sažetak sastanka je obavezan",
              })}
              size="lg"
            />
          </CardDescription>
          {errors.sazetak?.message && (
            <Text color="red" fontSize="xl">
              {errors.sazetak.message}
            </Text>
          )}
        </CardBody>
        <CardBody gap="10px">
          <Heading>{"Točke dnevnog reda:"}</Heading>
          {newMeeting.tockeDnevnogReda.map((tocka, index) => (
            <TockaDnevnogReda
              key={index}
              tocka={{
                id: 0,
                imeTocke: tocka.imeTocke,
                imaPravniUcinak: tocka.imaPravniUcinak,
                url: tocka.url,
                sastanakId: 0,
              }}
              rbr={index + 1}
              izbrisiTocka={izbrisiTocku}
            />
          ))}
        </CardBody>
        <CardBody gap="10px">
          <Heading>{"Nova točka dnevnog reda:"}</Heading>
          <Input
            placeholder="Ime točke dnevnog reda"
            type=""
            ref={tockaIme}
            onChange={(e) => {
              const tempT = newTocka;
              tempT.imeTocke = e.target.value;
              setNewTocka(tempT);
            }}
          />
          <Flex
            direction="row"
            gap="10px"
            alignItems="center"
            width="100%"
            justifyContent="space-between"
            wrap="wrap"
          >
            <Flex
              gap="20px"
              direction={{ base: "column", md: "row" }}
              alignItems="center"
            >
              <MenuRoot>
                <MenuTrigger asChild>
                  <Button
                    width={{ base: "100%", md: "25%" }}
                    border={"1px solid"}
                    borderColor={"gray.200"}
                    backgroundColor="gray.100"
                    color="black"
                    justifyContent="start"
                    overflow="hidden"
                    disabled={!discussionList || discussionList?.length == 0}
                  >
                    Odaberite diskusiju
                  </Button>
                </MenuTrigger>
                <MenuContent maxHeight="150px" overflow="scroll" width="100%">
                  {discussionList &&
                    discussionList.map((discussion, index) => {
                      return (
                        <MenuItem
                          value={discussion.naslov}
                          key={index}
                          onClick={() => {
                            if (tockaUrl.current) {
                              tockaUrl.current.value = discussion.link;
                              const tempT = newTocka;
                              tempT.url = discussion.link;
                              setNewTocka(tempT);
                            }
                          }}
                        >
                          {discussion.naslov}
                        </MenuItem>
                      );
                    })}
                </MenuContent>
              </MenuRoot>
              <Flex direction={{ base: "column", md: "row" }} width="100%">
                <Input
                  ref={tockaUrl}
                  readOnly={true}
                  type="url"
                  width={{ base: "100%", md: "60%" }}
                  mr="10px"
                  placeholder="poveznica na diskusiju..."
                />
                <Input
                  placeholder="Pretraži diskusije"
                  width={{ base: "100%", md: "30%" }}
                  ref={kljucnaRijecIme}
                />
                <IconButton
                  bg="gray.300"
                  onClick={async () =>
                    onSelectKeyword(kljucnaRijecIme?.current?.value)
                  }
                >
                  <LuSearch color="black" />
                </IconButton>
              </Flex>
              <Checkbox
                variant="subtle"
                ref={tockaBool}
                onChange={(e) => {
                  const tempT = newTocka;
                  tempT.imaPravniUcinak = (
                    e.target as HTMLInputElement
                  ).checked;
                  setNewTocka(tempT);
                }}
              >
                {"Ima pravni učinak"}
              </Checkbox>
            </Flex>
            <Button
              width="100px"
              color="white"
              bg="black"
              m={{ base: "auto", md: "" }}
              onClick={() => dodajTocku(newTocka)}
            >
              {"Dodaj točku"}
            </Button>
          </Flex>
          {errors.root?.message && (
            <Text color="red" fontSize="xl">
              {errors.root.message}
            </Text>
          )}
        </CardBody>
        <Button type="submit">
          {meeting ? "Pohrani promjene" : "Kreiraj sastanak"}
        </Button>
      </CardRoot>
    </>
  );
}
