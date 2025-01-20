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
import { createMutator, postMutator } from "@/fetchers/mutators";
import { useRouter } from "next/navigation";
import { BackToMeetingListButton } from "../BackToMeetingListButton/BackToMeetingListButton";
import { BackToHomeButton } from "../BackToHomeButton/BackToHomeButton";

interface IChangeForm {
  old_password: string;
  password: string;
  repeated_password: string;
}

export function ChangePasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<IChangeForm>({
    mode: "onChange",
  });

  const onCreate = async (data: IChangeForm) => {
    console.log(data);
    try {
      await trigger({
        newPassword: data.password,
        oldPassword: data.old_password,
      });
    } catch (err) {}
  };

  const { trigger } = useSWRMutation(swrKeys.changePassword, createMutator, {
    onSuccess: async (data) => {
      console.log(data);
      router.push("/home");
    },
    onError: async (error: { message: string }) => {
      setError("old_password", { message: error.message });
    },
  });

  const passwordRequirements = {
    required: "Unesite lozinku",
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
    <Flex flexDir="column" gap="10px">
      <BackToHomeButton />
      <Flex
        as="form"
        direction="column"
        onSubmit={handleSubmit(onCreate)}
        width="100%"
        padding="20px"
        backgroundColor="gray.100"
        borderRadius="10px"
        color="black"
      >
        <Heading textAlign="center" fontSize="x-large">
          Promjena lozinke
        </Heading>
        <Field
          label="Stara lozinka"
          invalid={Boolean(errors?.old_password)}
          errorText={errors?.old_password?.message}
          disabled={isSubmitting}
        >
          <PasswordInput
            {...register("old_password", passwordRequirements)}
            required
          />
        </Field>
        <Field
          label="Nova lozinka"
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
          label="Ponovljena nova lozinka"
          invalid={Boolean(errors?.repeated_password)}
          errorText={errors?.repeated_password?.message}
          disabled={isSubmitting}
        >
          <PasswordInput
            {...register("repeated_password", passwordConfirmationRequirements)}
          />
        </Field>
        <Button
          mt="40px"
          type="submit"
          bg="black"
          color="white"
          loading={isSubmitting}
        >
          {"Promijeni lozinku"}
        </Button>
      </Flex>
    </Flex>
  );
}
