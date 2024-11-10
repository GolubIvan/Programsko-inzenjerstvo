"use client";

import {
  FieldErrorText,
  FieldRoot,
  Fieldset,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { register } from "module";
import { error } from "console";
import { Button } from "@/components/ui/button";
import { RadioGroup, Radio } from "@/components/ui/radio";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { swrKeys } from "@/typings/swrKeys";
import { createMutator } from "@/fetchers/mutators";

interface ICreateForm {
  email: string;
  password: string;
  repeated_password: string;
  username: string;
  zgrada: string;
  role: "predstavnik" | "suvlasnik";
}

export function CreateForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<ICreateForm>({
    defaultValues: { role: "suvlasnik" },
    mode: "onChange",
  });

  const onCreate = async (data: ICreateForm) => {
    console.log(data);
    await trigger(data);
  };

  const { trigger } = useSWRMutation(swrKeys.createUser, createMutator, {
    onSuccess: async (data) => {
      console.log(data);
      reset();
    },
    onError: async (error: { message: string }) => {
      setError("zgrada", { message: error.message });
    },
  });

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
      <Heading textAlign="center" fontSize="x-large">
        Kreiranje novih korisnika
      </Heading>
      <Field
        label="Korisničko ime"
        invalid={Boolean(errors.username)}
        errorText={errors.username?.message}
        disabled={isSubmitting}
      >
        <Input {...register("username", usernameRequirements)} type="text" />
      </Field>
      <Field
        label="Email"
        invalid={Boolean(errors?.email)}
        errorText={errors?.email?.message}
        disabled={isSubmitting}
      >
        <Input {...register("email", emailRequirements)} type="email" />
      </Field>
      <Field
        label="Lozinka"
        invalid={Boolean(errors?.password)}
        errorText={errors?.password?.message}
        disabled={isSubmitting}
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
      >
        <Input {...register("zgrada", passwordRequirements)} required />
      </Field>
      <Field>
        <RadioGroup
          display="flex"
          flexDirection="row"
          width="100%"
          padding="7px"
          gap="10px"
          marginTop="10px"
          marginBottom="10px"
          defaultValue="suvlasnik"
          disabled={isSubmitting}
          {...register("role")}
        >
          <HStack>
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
      <Button type="submit" loading={isSubmitting}>
        Stvori{" "}
      </Button>
    </Flex>
  );
}
