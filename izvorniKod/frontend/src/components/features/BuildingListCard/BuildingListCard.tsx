import { Podaci } from "@/typings/user";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  IconButton,
  Text,
} from "@chakra-ui/react";
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
      width="60%"
      alignSelf="center"
      m="20px"
      bg="gray.300"
      variant="elevated"
    >
      <Card.Header fontSize="xl">{podatak.zgrada.address}</Card.Header>
      <Card.Body>
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          fontSize="large"
        >
          <Text
            color={podatak.uloga == "Predstavnik" ? "red.500" : "black"}
            textDecor="underline"
          >
            {podatak.uloga}
          </Text>
          <Button
            bgColor="gray.600"
            _hover={{ bgColor: "green.600" }}
            onClick={() => checkoutBuilding(podatak.zgrada.zgradaId)}
          >
            Enter
          </Button>
        </Flex>
      </Card.Body>
    </Card.Root>
  );
};
