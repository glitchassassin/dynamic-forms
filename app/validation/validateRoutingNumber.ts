export function validateRoutingNumber(routingNumber: string): boolean {
  console.log("validating routing number", routingNumber);
  if (routingNumber.length !== 9) return false;
  const digits = routingNumber.split("").map(Number);
  const checksum =
    (3 * (digits[0] + digits[3] + digits[6]) +
      7 * (digits[1] + digits[4] + digits[7]) +
      (digits[2] + digits[5] + digits[8])) %
    10;
  return checksum === 0;
}
