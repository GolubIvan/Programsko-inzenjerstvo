import { ITocka } from "@/typings/meeting";
import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { HiPaperClip } from "react-icons/hi";
import { LuPaperclip } from "react-icons/lu";

interface ITockaProps {
  tocka: ITocka;
  rbr: Number;
}
export function TockaDnevnogReda({ tocka, rbr }: ITockaProps) {
  return (
    <Flex flexDirection="row">
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
            <Link href={"https://" + tocka.url}>
              točka dnevnog reda motivirana ovom diskusijom{" "}
            </Link>{" "}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
