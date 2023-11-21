import type { customizeValidator as originalCustomizeValidator } from "@rjsf/validator-ajv8";
import validatorAjv8 from "@rjsf/validator-ajv8";
import { validateRoutingNumber } from "./validateRoutingNumber";

const { customizeValidator } = validatorAjv8 as unknown as {
  customizeValidator: typeof originalCustomizeValidator;
};

export const customFormats = {
  "routing-number": validateRoutingNumber,
};

export const serverValidator = customizeValidator({ customFormats });
