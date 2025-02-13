import { Podaci } from "@/typings/user";
import { Button, Card, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface IBuildingListCardProps {
  podatak: Podaci;
}

export const BuildingListCard = ({
  podatak: podatak,
}: IBuildingListCardProps) => {
  const router = useRouter();
  const checkoutBuilding = (id: number) => {
    router.push("/building/" + id);
  };
  return (
    <Card.Root
      width={{ base: "80%", md: "60%" }}
      alignSelf="center"
      m="20px"
      bg="gray.300"
      variant="elevated"
    >
      <Card.Header fontSize="xl" color="black">
        {podatak.key.address}
      </Card.Header>
      <Card.Body>
        <Flex
          direction={{ base: "column", sm: "row" }}
          alignItems="center"
          justifyContent="space-between"
          fontSize="large"
        >
          <Text
            color={podatak.value == "Predstavnik" ? "red.500" : "black"}
            textDecor="underline"
          >
            {podatak.value}
          </Text>
          <Button
            bgColor="gray.600"
            _hover={{ bgColor: "green.600" }}
            onClick={() => checkoutBuilding(podatak.key.zgradaId)}
          >
            Enter
          </Button>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
