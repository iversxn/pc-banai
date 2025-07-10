export function checkCompatibility(parts) {
  const messages = [];

  const cpu = parts["CPU"];
  const motherboard = parts["Motherboard"];
  const gpu = parts["GPU"];
  const psu = parts["PSU"];
  const casePart = parts["Case"];

  // Brand check
  if (cpu && motherboard && cpu.brand !== motherboard.brand) {
    messages.push("⚠ CPU and Motherboard brands do not match.");
  }

  // PSU Wattage
  if (psu && gpu && psu.watt && gpu.wattage_required) {
    if (psu.watt < gpu.wattage_required) {
      messages.push(`⚠ PSU wattage (${psu.watt}W) is too low for GPU (${gpu.wattage_required}W).`);
    }
  }

  // Case length check
  if (casePart && gpu && casePart.max_gpu_length && gpu.length) {
    if (gpu.length > casePart.max_gpu_length) {
      messages.push(
        `⚠ GPU length (${gpu.length}mm) exceeds Case limit (${casePart.max_gpu_length}mm).`
      );
    }
  }

  return messages;
}
