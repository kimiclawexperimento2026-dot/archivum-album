// Minimal bech32 (NIP-19): hex <-> npub. No deps.

const CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";

function polymod(values: number[]): number {
  const GEN = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (const v of values) {
    const b = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ v;
    for (let i = 0; i < 5; i++) if ((b >> i) & 1) chk ^= GEN[i];
  }
  return chk;
}

function hrpExpand(hrp: string): number[] {
  const codes: number[] = [];
  for (let i = 0; i < hrp.length; i++) codes.push(hrp.charCodeAt(i) >> 5);
  codes.push(0);
  for (let i = 0; i < hrp.length; i++) codes.push(hrp.charCodeAt(i) & 31);
  return codes;
}

function createChecksum(hrp: string, data: number[]): number[] {
  const values = [...hrpExpand(hrp), ...data, 0, 0, 0, 0, 0, 0];
  const mod = polymod(values) ^ 1;
  const ret: number[] = [];
  for (let p = 0; p < 6; p++) ret.push((mod >> (5 * (5 - p))) & 31);
  return ret;
}

function verifyChecksum(hrp: string, data: number[]): boolean {
  return polymod([...hrpExpand(hrp), ...data]) === 1;
}

function convertBits(data: number[], frombits: number, tobits: number, pad: boolean): number[] | null {
  let acc = 0;
  let bits = 0;
  const ret: number[] = [];
  const maxv = (1 << tobits) - 1;
  for (const value of data) {
    if (value < 0 || value >> frombits !== 0) return null;
    acc = (acc << frombits) | value;
    bits += frombits;
    while (bits >= tobits) {
      bits -= tobits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad) {
    if (bits > 0) ret.push((acc << (tobits - bits)) & maxv);
  } else if (bits >= frombits || ((acc << (tobits - bits)) & maxv)) {
    return null;
  }
  return ret;
}

export function hexToNpub(hex: string): string {
  const hrp = "npub";
  const data = convertBits(Array.from(Buffer.from(hex, "hex")), 8, 5, true)!;
  const checksum = createChecksum(hrp, data);
  let addr = hrp + "1";
  for (const d of [...data, ...checksum]) addr += CHARSET[d];
  return addr;
}

export function npubToHex(npub: string): string | null {
  if (npub.indexOf("1") === -1) return null;
  const pos = npub.lastIndexOf("1");
  const hrp = npub.substring(0, pos);
  const data: number[] = [];
  for (let i = pos + 1; i < npub.length; i++) {
    const c = CHARSET.indexOf(npub[i]);
    if (c === -1) return null;
    data.push(c);
  }
  if (!verifyChecksum(hrp, data)) return null;
  const bytes = convertBits(data.slice(0, -6), 5, 8, false);
  if (!bytes) return null;
  return Buffer.from(bytes).toString("hex");
}
