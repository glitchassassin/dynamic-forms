import Form from "@rjsf/bootstrap-4";
import type { FormProps } from "@rjsf/core";
import type { RJSFSchema } from "@rjsf/utils";
import { validator } from "~/validation/index.client";

export function CustomForm(
  props: Omit<FormProps<any, RJSFSchema, any>, "validator">
) {
  return <Form {...props} validator={validator} />;
}
