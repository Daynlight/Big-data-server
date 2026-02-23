import pako from "pako";

const compressFile = async (file) => {
  if(!file) return;

  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  const compressed = pako.gzip(uint8Array)

  let binary = ""
  for (let i = 0; i < compressed.length; i++) {
    binary += String.fromCharCode(compressed[i])
  }

  return btoa(binary);
};

const splitFile = (file) => {
  if(!file) return;

  let Chunks = [];

  for (let i = 0; i < file.length; i += 1024**1 * 1)
    Chunks.push(file.substring(i, i + 1024**1 * 1))

  return Chunks;
};

const generateHash = async (data) => {
  const encoder = new TextEncoder()
  const encoded = encoder.encode(data)

  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded)

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hash = hashArray
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")

  return hash;
};

export default {
  compressFile,
  splitFile,
  generateHash
}