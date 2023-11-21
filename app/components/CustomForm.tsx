import type { FormProps } from "@rjsf/core";
import Form from "@rjsf/core";
import type {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  ValidatorType,
} from "@rjsf/utils";
import { validator } from "~/validation/index.client";

export function CustomForm<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(props: Omit<FormProps<T, S, F>, "validator">) {
  return <Form {...props} validator={validator as ValidatorType<T, S, F>} />;
}
