// Configuração de rede (fonte única p/ presale e packs).
// O flip mainnet é UM commit: trocar NETWORK para "mainnet" + novas chaves do emissor.

export type NetworkName = "testnet" | "mainnet";

export const NETWORK: NetworkName = "mainnet" as NetworkName; // MAINNET LIVE desde 2026-09-24

export const HORIZON =
  NETWORK === "mainnet"
    ? "https://horizon.stellar.org"
    : "https://horizon-testnet.stellar.org";

export const NETWORK_PASSPHRASE =
  NETWORK === "mainnet"
    ? "Public Global Stellar Network ; September 2015"
    : "Test SDF Network ; September 2015";

// Distribuidora = EMISSORA no mainnet (auto-emissão na venda — mesma keypair
// do cofre da pré-venda, scripts/config_presale.json). Chaves travadas fora do repo.
export const DISTRIBUTION = "GCU72VRE26KQGSO7BXDGUWPL3JNP7CZ6HV7EELULALURHJGSHJBT4XQU";
export const ISSUER = DISTRIBUTION; // mainnet: o cofre emite (mint na venda)
export const ASSET_CODE = "ARCHIVUM";
export const PACK_PRICE = "100"; // ARCH queimados por pack (5 cartas)

// Arte oficial das figurinhas — dark fantasy AI (gen: scripts/gen_ai_art.sh)
export const CARD_ART: Record<string, string> = {
  "001": "/cards/001_the-star-devourer.png",
  "002": "/cards/002_the-eternal-winter.png",
  "003": "/cards/003_the-primordial-chaos.png",
  "004": "/cards/004_the-feathered-serpent.png",
  "005": "/cards/005_the-earth-titan.png",
  "006": "/cards/006_the-three-headed-venom.png",
  "007": "/cards/007_the-world-serpent.png",
  "008": "/cards/008_the-sea-storm.png",
  "009": "/cards/009_the-star-of-darkness.png",
  "010": "/cards/010_the-abyssal-leviathan.png",
};
export const cardArt = (id: string): string => CARD_ART[id] ?? "/emblem.svg";
