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
import {
  changePasswordMutator,
  createMutator,
  postMutator,
} from "@/fetchers/mutators";
import { useRouter } from "next/navigation";

interface IChangeForm {
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
    await trigger({ password: data.password });
  };

  const { trigger } = useSWRMutation(
    swrKeys.changePassword,
    changePasswordMutator,
    {
      onSuccess: async (data) => {
        console.log(data);
        router.push("/home");
      },
      onError: async (error: { message: string }) => {
        setError("password", { message: error.message });
      },
    }
  );

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
        Promjena lozinke
      </Heading>

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
      <Button mt="40px" type="submit" loading={isSubmitting}>
        {"Promijeni lozinku"}
      </Button>
    </Flex>
  );
}
