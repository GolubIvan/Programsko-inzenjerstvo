import { ITocka } from "@/typings/meeting";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LuPaperclip } from "react-icons/lu";

interface ITockaProps {
  tocka: ITocka;
  rbr: number;
  updateStanjeZakljucka: (stanje: "Izglasan" | "Odbijen", rbr: number) => void;
  updateTekstZakljucka: (tekst: string, rbr: number) => void;
}

export function EditableTocka({
  tocka,
  rbr,
  updateStanjeZakljucka,
  updateTekstZakljucka,
}: ITockaProps) {
  const [stanje, setStanje] = useState(
    tocka.stanjeZakljucka ? tocka.stanjeZakljucka.toString() : ""
  );

  const [inputValue, setInputValue] = useState(tocka.sazetak || "");

  useEffect(() => {
    setInputValue(tocka.sazetak || "");
  }, [tocka.sazetak]);

  useEffect(() => {
    updateTekstZakljucka(tocka.sazetak || "", tocka.id);
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    updateTekstZakljucka(e.target.value, tocka.id);
  };
  return (
    <Flex flexDirection="row">
      <Text width="30px"> {rbr.toString() + "."} </Text>
      <Flex flexDir="column" width="100%">
        <Flex flexDirection="row" gap="5px">
          <Text fontWeight="bold">{tocka.imeTocke}</Text>
          {tocka.imaPravniUcinak && (
            <Text fontWeight="bold" fontStyle="italic" color="orange.600">
              (točka s pravnim učinkom)
            </Text>
          )}
        </Flex>

        <Flex flexDir="row" justifyContent="space-between" alignItems="center">
          <Text width="170px" textAlign="center">
            {"Zaključak točke:"}
          </Text>
          <Input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="Neki tekst..."
          />
        </Flex>
        {tocka.imaPravniUcinak && (
          <Flex flexDir="row" alignItems="center" gap="10px">
            <Text width="150px" textAlign="center">
              {"Stanje zaključka:"}
            </Text>
            <Text
              fontWeight={stanje == "Izglasan" ? "bold" : "normal"}
              color="green"
              onClick={() => {
                setStanje("Izglasan");
                updateStanjeZakljucka("Izglasan", tocka.id);
              }}
            >
              Izglasan
            </Text>
            <Text> | </Text>
            <Text
              fontWeight={stanje == "Odbijen" ? "bold" : "normal"}
              color="red.500"
              onClick={() => {
                setStanje("Odbijen");
                updateStanjeZakljucka("Odbijen", tocka.id);
              }}
            >
              Odbijen
            </Text>
          </Flex>
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
