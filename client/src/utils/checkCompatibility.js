export function checkCompatibility(parts) {
  const messages = [];
  const { CPU, Motherboard, RAM } = parts;

  if (CPU && Motherboard) {
    if (CPU.socket !== Motherboard.socket) {
      messages.push(`CPU socket (${CPU.socket}) and Motherboard socket (${Motherboard.socket}) do not match.`);
    }
  }

  if (RAM && (Motherboard || CPU)) {
    const requiredMemory = Motherboard?.memoryType || CPU?.memoryType;
    if (requiredMemory && !requiredMemory.includes(RAM.memoryType)) {
        messages.push(`RAM type (${RAM.memoryType}) is not compatible with the required type (${requiredMemory}).`);
    }
  }

  return messages;
}
