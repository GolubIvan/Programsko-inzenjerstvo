import { ITocka } from "@/typings/meeting";
import { Flex, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LuPaperclip, LuTrash } from "react-icons/lu";

interface ITockaProps {
  tocka: ITocka;
  rbr: number;
  izbrisiTocka?: (rbr: number) => void;
}
export function TockaDnevnogReda({ tocka, rbr, izbrisiTocka }: ITockaProps) {
  return (
    <Flex flexDirection="row" alignItems="center">
      <Text width="30px"> {rbr.toString() + "."} </Text>
      <Flex flexDir="column">
        <Flex flexDirection="row" gap="5px">
          <Text fontWeight="bold">{tocka.imeTocke}</Text>
          {tocka.imaPravniUcinak && (
            <Text fontWeight="bold" fontStyle="italic" color="orange.600">
              (točka s pravnim učinkom)
            </Text>
          )}
        </Flex>

        <Text>{tocka.sazetak}</Text>
        {tocka.stanjeZakljucka == "Izglasan" && (
          <Text fontWeight="bold" color="green">
            {tocka.stanjeZakljucka}
          </Text>
        )}
        {tocka.stanjeZakljucka == "Odbijen" && (
          <Text fontWeight="bold" color="red">
            {tocka.stanjeZakljucka}
          </Text>
        )}
        {tocka.url && (
          <Text
            display="flex"
            fontStyle="italic"
            flexDir="row"
            gap="5px"
            alignItems="center"
          >
            <LuPaperclip />
            <Link href={tocka.url}>
              točka dnevnog reda motivirana ovom diskusijom{" "}
            </Link>
          </Text>
        )}
      </Flex>
      {izbrisiTocka && (
        <IconButton
          bg="white"
          color="black"
          ml="auto"
          mr="20px"
          onClick={() => izbrisiTocka(rbr)}
        >
          <LuTrash />
        </IconButton>
      )}
    </Flex>
  );
}
