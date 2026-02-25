import pako from "pako";







const compressFile = async (file) => {
  if(!file) return;

  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  const compressed = pako.gzip(uint8Array);

  let binary = "";
  for (let i = 0; i < compressed.length; i++)
    binary += String.fromCharCode(compressed[i]);

  return btoa(binary);
};




const decompressFile = async (base64OrUint8) => {
  if (!base64OrUint8) return;

  let uint8;

  if (base64OrUint8 instanceof Uint8Array) {
    const text = new TextDecoder().decode(base64OrUint8);
    const binaryString = atob(text);

    uint8 = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++)
      uint8[i] = binaryString.charCodeAt(i);

  } else {
    return;
  };

  const decompressed = pako.ungzip(uint8);

  return new TextDecoder().decode(decompressed);
};




const splitFile = (file) => {
  if(!file) return;

  let Chunks = [];

  for (let i = 0; i < file.length; i += 1024**2 * 10)
    Chunks.push(file.substring(i, i + 1024**2 * 10));

  return Chunks;
};




const mergeChunks = (chunks) => {
  if (!chunks || !Array.isArray(chunks)) return null;

  const buffers = chunks.map(chunk => {
    if (chunk instanceof ArrayBuffer)
      return new Uint8Array(chunk);

    if (chunk.data)
      return new Uint8Array(chunk.data);

    return new Uint8Array(chunk);
  });

  const totalLength = buffers.reduce((acc, buf) => acc + buf.length, 0);

  const merged = new Uint8Array(totalLength);

  let offset = 0;
  for (const buf of buffers) {
    merged.set(buf, offset);
    offset += buf.length;
  };

  return merged;
};




const generateHash = async (data) => {
  const encoder = new TextEncoder();
  const encoded = encoder.encode(data);

  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return hash;
};




async function generateHashFromBufferObject(bufferObject) {
  const uint8Array = new Uint8Array(bufferObject.data);

  const hashBuffer = await crypto.subtle.digest("SHA-256", uint8Array);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};




const compareHashes = async (data, hash) =>{
  let validate_hash = await generateHashFromBufferObject(data);
  return hash == validate_hash;
};







export default {
  compressFile,
  decompressFile,
  splitFile,
  mergeChunks,
  generateHash,
  generateHashFromBufferObject,
  compareHashes
};