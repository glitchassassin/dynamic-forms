import { customizeValidator } from "@rjsf/validator-ajv8";
import { validateRoutingNumber } from "./validateRoutingNumber";

export const customFormats = {
  "routing-number": validateRoutingNumber,
};

export const validator = customizeValidator({ customFormats });

console.log("validator", validator);
