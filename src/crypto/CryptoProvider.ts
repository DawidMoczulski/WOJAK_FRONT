export async function GenerateRSAKeys() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  // Export the keys in Base64 format
  const publicKeyBinary = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );
  const privateKeyBinary = await window.crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey
  );

  const publicKey = btoa(
    String.fromCharCode(...new Uint8Array(publicKeyBinary))
  );
  const privateKey = btoa(
    String.fromCharCode(...new Uint8Array(privateKeyBinary))
  );

  return { publicKey, privateKey };
}

// export async function generateAESKey() {
//   const aesKey = await window.crypto.subtle.generateKey(
//     {
//       name: "AES-GCM",
//       length: 256,
//     },
//     true,
//     ["encrypt", "decrypt"]
//   );

//   // Convert AESKey into Base64
//   const exportedAESKey = await window.crypto.subtle.exportKey("raw", aesKey);
//   return btoa(String.fromCharCode(...new Uint8Array(exportedAESKey)));
// }

export async function encryptWithRSA(
  publicKeyBase64: string,
  dataToEncrypt: string
): Promise<string> {
  // Decode base64 to Uint8Array
  const binaryString = atob(publicKeyBase64);
  const publicKeyBuffer = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    publicKeyBuffer[i] = binaryString.charCodeAt(i);
  }

  // Import public key
  const publicKey = await window.crypto.subtle.importKey(
    "spki",
    publicKeyBuffer.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["encrypt"]
  );

  // Encrypt the AES key
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    new TextEncoder().encode(dataToEncrypt)
  );

  // Convert encrypted result to base64 string
  const encryptedBytes = new Uint8Array(encryptedBuffer);
  const encryptedBase64 = btoa(String.fromCharCode(...encryptedBytes));

  return encryptedBase64;
}

export async function decryptWithRSA(
  privateKeyBase64: string,
  encryptedDataBase64: string
) {
  const privateKeyBuffer = new Uint8Array(
    atob(privateKeyBase64)
      .split("")
      .map((c) => c.charCodeAt(0))
  );

  const privateKey = await window.crypto.subtle.importKey(
    "pkcs8",
    privateKeyBuffer,
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"]
  );
  const encryptedDataBuffer = new Uint8Array(
    atob(encryptedDataBase64)
      .split("")
      .map((c) => c.charCodeAt(0))
  );
  let decryptedData;
  try {
    decryptedData = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedDataBuffer
    );
  } catch (err) {
    console.log("error with decrypted data", err);
  }
  return new TextDecoder().decode(decryptedData);
}

// export async function encryptWithAES(message: string, aesKeyBase64: string) {
//   const iv = window.crypto.getRandomValues(new Uint8Array(16));
//   const ivBase64 = btoa(String.fromCharCode(...iv));

//   const aesKeyBuffer = new Uint8Array(
//     atob(aesKeyBase64)
//       .split("")
//       .map((c) => c.charCodeAt(0))
//   );

//   const aesCryptoKey = await window.crypto.subtle.importKey(
//     "raw",
//     aesKeyBuffer,
//     { name: "AES-GCM" },
//     false,
//     ["encrypt"]
//   );

//   const encryptedMessage = await window.crypto.subtle.encrypt(
//     { name: "AES-GCM", iv },
//     aesCryptoKey,
//     new TextEncoder().encode(message)
//   );

//   return {
//     encryptedMessage: btoa(
//       String.fromCharCode(...new Uint8Array(encryptedMessage))
//     ),
//     iv: ivBase64,
//   };
// }

// export async function decryptWithAES(
//   encryptedMessageBase64: string,
//   aesKeyBase64: string,
//   ivBase64: string
// ) {
//   const encryptedMessageBuffer = new Uint8Array(
//     atob(encryptedMessageBase64)
//       .split("")
//       .map((c) => c.charCodeAt(0))
//   );
//   const aesKeyBuffer = new Uint8Array(
//     atob(aesKeyBase64)
//       .split("")
//       .map((c) => c.charCodeAt(0))
//   );
//   const ivBuffer = new Uint8Array(
//     atob(ivBase64)
//       .split("")
//       .map((c) => c.charCodeAt(0))
//   );

//   const aesCryptoKey = await window.crypto.subtle.importKey(
//     "raw",
//     aesKeyBuffer,
//     { name: "AES-GCM" },
//     false,
//     ["decrypt"]
//   );

//   const decryptedMessage = await window.crypto.subtle.decrypt(
//     { name: "AES-GCM", iv: ivBuffer },
//     aesCryptoKey,
//     encryptedMessageBuffer
//   );

//   return new TextDecoder().decode(decryptedMessage);
// }
