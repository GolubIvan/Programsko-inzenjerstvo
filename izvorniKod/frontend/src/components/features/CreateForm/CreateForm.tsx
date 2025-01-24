"use client";

import {
  Box,
  Collapsible,
  createListCollection,
  FieldErrorText,
  FieldRoot,
  Fieldset,
  Flex,
  Heading,
  HStack,
  Input,
  List,
  ListCollection,
  ListItem,
  ListRoot,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { register } from "module";
import { error } from "console";
import { Button } from "@/components/ui/button";
import { RadioGroup, Radio } from "@/components/ui/radio";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { swrKeys } from "@/typings/swrKeys";
import { createMutator } from "@/fetchers/mutators";
import { authFetcher } from "@/fetchers/fetcher";
import useSWR, { useSWRConfig } from "swr";
import { Certificate } from "crypto";

interface ICreateForm {
  email: string;
  password: string;
  repeated_password: string;
  username: string;
  zgrada: string;
  role: "Predstavnik" | "Suvlasnik" | "Administrator";
}

interface IZgrada {
  address: string;
  zgradaId: number;
}

export function CreateForm() {
  const { data, isLoading, error } = useSWR<{ zgrade: Array<IZgrada> }>(
    swrKeys.building(""),
    authFetcher
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ICreateForm>({
    defaultValues: { role: "Suvlasnik" },
    mode: "onChange",
  });

  const { mutate } = useSWR(swrKeys.building(""));

  const onCreate = async (data: ICreateForm) => {
    if (!data.zgrada) {
      setError("zgrada", { message: "Odaberite adresu ili unesite novu" });
      return;
    }
    await trigger(data);
    await mutate(null);
  };

  const { trigger } = useSWRMutation(swrKeys.createUser, createMutator, {
    onSuccess: async (data) => {
      reset();
      setOther(false);
      setSelectedAddress("");
      setSomethingSelected(false);
    },
    onError: async (error: { message: string }) => {
      setError("zgrada", { message: error.message });
    },
  });

  const [other, setOther] = useState(false);

  const [somethingSelected, setSomethingSelected] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  if (error) {
    if (error.status !== 401) return <Box>Something went wrong...</Box>;
  }
  if (isLoading || !data) {
    return <Box>Loading...</Box>;
  }
  const emailRequirements = {
    required: "Unesite email",
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: "Unesena vrijednost ne odgovara email formatu",
    },
  };

  const usernameRequirements = {
    required: "Unesite korisničko ime",
  };

  const passwordRequirements = {
    required: "Unesite lozinku",
    /* minLength: {
      value: 8,
      message: "Lozinka se mora sastojati od barem 8 znakova",
    }, */
  };

  const passwordConfirmationRequirements = {
    ...passwordRequirements,
    validate: {
      equals: (value: string) => {
        return (
          watch("password") == value ||
          "Lozinka i ponovljena lozinka moraju biti jednake"
        );
      },
    },
  };

  const addressRequirements = {
    required: "Odaberite adresu ili unesite novu",
  };

  return (
    <Flex
      as="form"
      direction="column"
      onSubmit={handleSubmit(onCreate)}
      width="100%"
      padding="20px"
      backgroundColor="gray.100"
      borderRadius="10px"
    >
      <Heading
        textAlign="center"
        fontSize="x-large"
        color="black"
        paddingBottom="10px"
      >
        Kreiranje novih korisnika
      </Heading>
      <Field
        label="Korisničko ime"
        invalid={Boolean(errors.username)}
        errorText={errors.username?.message}
        disabled={isSubmitting}
        color="black"
      >
        <Input {...register("username", usernameRequirements)} type="text" />
      </Field>
      <Field
        label="Email"
        invalid={Boolean(errors?.email)}
        errorText={errors?.email?.message}
        disabled={isSubmitting}
        color="black"
      >
        <Input {...register("email", emailRequirements)} type="email" />
      </Field>
      <Field
        label="Lozinka"
        invalid={Boolean(errors?.password)}
        errorText={errors?.password?.message}
        disabled={isSubmitting}
        color="black"
      >
        <PasswordInput
          {...register("password", passwordRequirements)}
          required
        />
      </Field>
      <Field
        label="Ponovljena lozinka"
        invalid={Boolean(errors?.repeated_password)}
        errorText={errors?.repeated_password?.message}
        disabled={isSubmitting}
        color="black"
      >
        <PasswordInput
          {...register("repeated_password", passwordConfirmationRequirements)}
        />
      </Field>
      <Field
        label="Adresa"
        invalid={Boolean(errors?.zgrada)}
        errorText={errors?.zgrada?.message}
        disabled={isSubmitting}
        color="black"
      >
        <MenuRoot>
          <MenuTrigger asChild>
            <Button
              width="100%"
              border={"1px solid"}
              borderColor={"gray.200"}
              backgroundColor="gray.100"
              color="black"
              justifyContent="start"
            >
              Odaberite s popisa
            </Button>
          </MenuTrigger>
          <MenuContent maxHeight="150px" overflow="scroll" width="100%">
            <MenuItem
              value={"other"}
              onClick={() => {
                setOther(true);
                setValue("zgrada", "");
                setSomethingSelected(true);
              }}
            >
              {"... dodaj novu adresu"}
            </MenuItem>
            {data.zgrade.map((zgr, index) => {
              return (
                <MenuItem
                  value={zgr.address}
                  key={zgr.zgradaId}
                  onClick={() => {
                    setOther(false);
                    setSelectedAddress(zgr.address);
                    setValue("zgrada", zgr.address);
                    setSomethingSelected(true);
                  }}
                >
                  {" "}
                  {zgr.address}
                </MenuItem>
              );
            })}
          </MenuContent>
        </MenuRoot>
        {other && (
          <Input
            type="text"
            {...register("zgrada", addressRequirements)}
            placeholder="Nova adresa"
          />
        )}
        {!other && somethingSelected && (
          <Input
            type="text"
            {...register("zgrada")}
            placeholder={"Još niste unijeli adresu"}
            readOnly
            defaultValue={selectedAddress}
            color="black"
          />
        )}
      </Field>
      <Field>
        <RadioGroup
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
          width="100%"
          padding="7px"
          gap="10px"
          marginTop="10px"
          marginBottom="10px"
          defaultValue="Suvlasnik"
          disabled={isSubmitting}
          {...register("role")}
          color="black"
        >
          <HStack
            display="flex"
            flexDirection={{ base: "column", sm: "row" }}
            alignItems={{ base: "flex-start" }}
          >
            <Radio value="Suvlasnik" {...register("role")}>
              Suvlasnik
            </Radio>
            <Radio value="Predstavnik" {...register("role")}>
              Predstavnik
            </Radio>
            <Radio value="Administrator" {...register("role")}>
              Administrator
            </Radio>
          </HStack>
        </RadioGroup>
      </Field>
      <Button bg="black" color="white" type="submit" loading={isSubmitting}>
        Stvori{" "}
      </Button>
    </Flex>
  );
}
