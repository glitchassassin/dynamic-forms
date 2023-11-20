import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { Col, Container, Row } from "react-bootstrap";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { SubmitButton } from "~/components/SubmitButton";
import { TextInput } from "~/components/TextInput";
import { TextareaInput } from "~/components/TextareaInput";
import { getFormSchema, setFormSchema } from "~/db/formSchema.server";

const validator = withZod(
  z.object({
    formId: z.string().optional(),
    formName: z.string(),
    formSchema: z.string(),
  })
);

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const formId = params.formId;
  invariant(typeof formId === "string", "Form ID not found.");

  // load form from MongoDB
  const result = await getFormSchema(formId);

  return json({
    formId: result?._id ?? "",
    formName: result?.name ?? "",
    formSchema: result?.schema ?? "",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    return validationError(result.error);
  }

  // commit form to MongoDB

  const formSchema = await setFormSchema({
    _id: result.data.formId,
    name: result.data.formName,
    schema: result.data.formSchema,
  });

  if (formSchema === null) {
    return json({ error: "Failed to save form." }, { status: 500 });
  }

  return redirect(`/edit/${formSchema._id}`);
};

export default function EditSchema() {
  const navigation = useNavigation();
  const { formId, formName, formSchema } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Row>
        <Col>
          <h1>Edit Schema</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ValidatedForm
            validator={validator}
            method="post"
            defaultValues={{
              formId,
              formName,
              formSchema,
            }}
          >
            <input type="hidden" name="formId" value={formId} />
            <TextInput name="formName" label="Form Name" className="mb-3" />
            <TextareaInput
              name="formSchema"
              label="Form Schema"
              className="font-monospace mb-3"
            />
            <SubmitButton label="Save" loading={navigation.state !== "idle"} />
          </ValidatedForm>
        </Col>
      </Row>
    </Container>
  );
}
