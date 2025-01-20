import { IconButton, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { BiChevronLeft } from "react-icons/bi";

export const BackToHomeButton = () => {
  const router = useRouter();
  const params = useParams();
  return (
    <IconButton
      bg="gray.300"
      variant="ghost"
      color="black"
      onClick={() => {
        router.push(`/home`);
      }}
    >
      <BiChevronLeft />
      <Text>{"Natrag"}</Text>
    </IconButton>
  );
};
