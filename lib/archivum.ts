// Configuração de rede (fonte única p/ presale e packs).
// O flip mainnet é UM commit: trocar NETWORK para "mainnet" + novas chaves do emissor.

export type NetworkName = "testnet" | "mainnet";

export const NETWORK: NetworkName = "testnet" as NetworkName; // flip commit → "mainnet"

export const HORIZON =
  NETWORK === "mainnet"
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org";

export const NETWORK_PASSPHRASE =
  NETWORK === "mainnet"
    ? "Public Global Stellar Network ; September 2015"
    : "Test SDF Network ; September 2015";

// Distribuidora: MESMA keypair nas duas redes — o endereço já é válido no mainnet,
// aguardando funding (~25 XLM) para ativação automática das vendas reais.
export const DISTRIBUTION = "GCU72VRE26KQGSO7BXDGUWPL3JNP7CZ6HV7EELULALURHJGSHJBT4XQU";
// Emissor testnet. No flip mainnet: gerar keypair novo, emitir supply e travar.
export const ISSUER = "GDCCEQKHW2SWHOMP4MZSB3DIWSSF7CFUL6JKCTHTY2AO4MWHLLYBDAMR";
export const ASSET_CODE = "ARCHIVUM";
export const PACK_PRICE = "100"; // ARCH queimados por pack (5 cartas)

// Arte das pranchas gravadas (bestiário xilogravado, gerado por plate_gen.py)
export const CARD_ART: Record<string, string> = {
  "001": "/plates/001_the-star-devourer.svg",
  "002": "/plates/002_the-eternal-winter.svg",
  "003": "/plates/003_the-primordial-chaos.svg",
  "004": "/plates/004_the-feathered-serpent.svg",
  "005": "/plates/005_the-earth-titan.svg",
  "006": "/plates/006_the-three-headed-venom.svg",
  "007": "/plates/007_the-world-serpent.svg",
  "008": "/plates/008_the-sea-storm.svg",
  "009": "/plates/009_the-star-of-darkness.svg",
  "010": "/plates/010_the-abyssal-leviathan.svg",
};
export const cardArt = (id: string): string => CARD_ART[id] ?? "/emblem.svg";
