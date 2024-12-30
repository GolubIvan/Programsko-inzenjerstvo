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
import { useState } from "react";
import { CgPin, CgCalendarDates } from "react-icons/cg";
import { BiEdit } from "react-icons/bi";
import { TockaDnevnogReda } from "../TockaDnevnogReda/TockaDnevnogReda";
import { useForm } from "react-hook-form";

interface IMeetingForm {
  naslov: string;
  opis: string;
  mjesto: string;
  vrijeme: Date;
  status: "Obavljen" | "Objavljen" | "Planiran" | "Arhiviran";
  zgradaId: Number;
  sazetak: string;
  tockeDnevnogReda: ITocka[];
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
  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { isSubmitting },
    watch,
    reset,
  } = useForm<IMeetingForm>();
  const [hovered, setHovered] = useState(false);
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    control: control2,
    getValues: getValues2,
    formState: { isSubmitting: isSibmitting2 },
    watch: watch2,
    reset: reset2,
  } = useForm<ITockaForm>({
    defaultValues: {
      imeTocke: "",
      imaPravniUcinak: false,
    },
  });
  const date = new Date(newMeeting.vrijeme);
  return (
    <CardRoot margin="3%" marginBottom="0" padding="10px">
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
          <TockaDnevnogReda key={index} tocka={tocka} rbr={index + 1} />
        ))}
      </CardBody>
      <CardBody gap="10px">
        <Heading>{"Nova točka dnevnog reda:"}</Heading>
        <Input
          placeholder="Ime točke dnevnog reda"
          type=""
          {...register2("imeTocke", { required: true })}
        />
        <Flex direction="row">
          <Input
            type="url"
            placeholder="Poveznica na diskusiju (opcionalno)"
            width="400px"
          ></Input>
        </Flex>
      </CardBody>
    </CardRoot>
  );
}
