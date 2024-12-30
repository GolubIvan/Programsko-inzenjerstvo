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
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgPin, CgCalendarDates } from "react-icons/cg";
import { BiEdit } from "react-icons/bi";
import { TockaDnevnogReda } from "../TockaDnevnogReda/TockaDnevnogReda";
import { useForm } from "react-hook-form";
import { Radio, RadioGroup } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox";
import { swrKeys } from "@/typings/swrKeys";
import { createMutator } from "@/fetchers/mutators";
import useSWRMutation from "swr/mutation";

interface IMeetingForm {
  naslov: string;
  opis: string;
  mjesto: string;
  vrijeme: Date;
  status: "Obavljen" | "Objavljen" | "Planiran" | "Arhiviran";
  zgradaId: Number;
  sazetak: string;
  tockeDnevnogReda: ITockaForm[];
}

interface ITockaForm {
  imeTocke: string;
  imaPravniUcinak: Boolean;
  sazetak?: string;
  stanjeZakljucka?: "Izglasan";
  url?: string;
}

export function CreateMeetingForm() {
  const params = useParams();
  const router = useRouter();
  const [newMeeting, setNewMeeting] = useState<IMeetingForm>({
    naslov: "",
    opis: "",
    mjesto: "",
    vrijeme: new Date(),
    sazetak: "",
    zgradaId: Number(params.zgradaId),
    status: "Planiran",
    tockeDnevnogReda: [],
  });

  const [newTocka, setNewTocka] = useState<ITockaForm>({
    imeTocke: "",
    imaPravniUcinak: false,
    sazetak: "",
    url: "",
    stanjeZakljucka: "Izglasan",
  });
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { isSubmitting },
    watch,
    reset,
    setError,
    setValue,
  } = useForm<IMeetingForm>({
    defaultValues: newMeeting,
  });
  setValue("status", "Planiran");
  setValue("zgradaId", newMeeting.zgradaId);
  const dodajTocku = (data: ITockaForm) => {
    const tock = { ...data };
    setNewMeeting((prev) => ({
      ...prev,
      tockeDnevnogReda: [...prev.tockeDnevnogReda, tock],
    }));
  };
  useEffect(() => {
    console.log(newMeeting); // This will log the updated state
    setValue("tockeDnevnogReda", newMeeting.tockeDnevnogReda);
  }, [newMeeting]);
  const createForm = async (data: IMeetingForm) => {
    console.log(data);
    await trigger(data);
  };

  const { trigger } = useSWRMutation(swrKeys.createMeeting, createMutator, {
    onSuccess: async (data) => {
      console.log(data);
      reset();
      router.push(`/building/${params.zgradaId}`);
    },
    onError: async (error: { message: string }) => {
      setError("sazetak", { message: error.message });
    },
  });

  return (
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
            {...register("naslov", { required: true })}
            size="2xl"
          />
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
          <Text textAlign="center" color={"red"} fontWeight="bold">
            {newMeeting.status}
          </Text>
        </Heading>
      </CardBody>
      <CardBody>
        <Heading>Opis:</Heading>
        <CardDescription fontSize="1rem">
          {" "}
          <Input
            type="text"
            placeholder="Opis sastanka"
            {...register("opis", { required: true })}
            size="lg"
          />
        </CardDescription>
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
              {...register("vrijeme", { required: true })}
            />
          </Flex>
        </Flex>
        <Flex direction="row" gap="5px" alignItems="center">
          <CgPin />{" "}
          <Input
            placeholder="Mjesto"
            {...register("mjesto", { required: true })}
            width="200px"
          />
        </Flex>
      </CardBody>
      <CardBody>
        <Heading>Sažetak:</Heading>
        <CardDescription fontSize="1rem">
          {" "}
          <Input
            type="text"
            placeholder="Sažetak sastanka"
            {...register("sazetak", { required: true })}
            size="lg"
          />
        </CardDescription>
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
          />
        ))}
      </CardBody>
      <CardBody gap="10px">
        <Heading>{"Nova točka dnevnog reda:"}</Heading>
        <Input
          placeholder="Ime točke dnevnog reda"
          type=""
          onChange={(e) => {
            let tempT = newTocka;
            tempT.imeTocke = e.target.value;
            setNewTocka(tempT);
          }}
        />
        <Flex
          direction="row"
          gap="30px"
          alignItems="center"
          width="100%"
          justifyContent="space-between"
          wrap="wrap"
        >
          <Flex gap="10px">
            <Input
              type="url"
              placeholder="Poveznica na diskusiju (opcionalno)"
              onChange={(e) => {
                let tempT = newTocka;
                tempT.url = e.target.value;
                setNewTocka(tempT);
              }}
              width="400px"
            />
            <Checkbox
              variant="subtle"
              onChange={(e) => {
                let tempT = newTocka;
                tempT.imaPravniUcinak = (e.target as HTMLInputElement).checked;
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
            onClick={() => dodajTocku(newTocka)}
          >
            {"Dodaj točku"}
          </Button>
        </Flex>
      </CardBody>
      <Button type="submit"> {"Kreiraj sastanak"} </Button>
    </CardRoot>
  );
}
