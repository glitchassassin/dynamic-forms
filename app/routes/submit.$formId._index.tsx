import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Col, Container, Row } from "react-bootstrap";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import { getFormSchema } from "~/db/formSchema.server";
import { setFormSubmission } from "~/db/formSubmissions.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const formId = params.formId;
  invariant(typeof formId === "string", "Form ID not found.");

  const formSchema = await getFormSchema(formId);
  invariant(formSchema !== null, "Form schema not found.");

  return json({
    formId: formSchema._id,
    name: formSchema.name,
    schema: formSchema.schema,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = formData.get("data");
  const formId = formData.get("formId");
  invariant(typeof data === "string", "Form data not found.");
  invariant(typeof formId === "string", "Form ID not found.");

  const submission = await setFormSubmission({
    schema: formId,
    data: data,
  });

  if (submission) return redirect(`/submit/${formId}/${submission._id}`);

  console.log("could not find submission");

  return null;
};

export default function SubmitForm() {
  const { formId, schema, name } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const onSubmit = ({ formData }: IChangeEvent<FormData>) => {
    fetcher.submit(
      { formId: formId ?? null, data: JSON.stringify(formData) },
      { method: "POST" }
    );
  };
  return (
    <Container>
      <Row>
        <Col>
          <h1>Submit {name}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ClientOnly>
            {() => (
              <Form
                method="post"
                schema={JSON.parse(schema)}
                validator={validator}
                onSubmit={onSubmit}
              />
            )}
          </ClientOnly>
        </Col>
      </Row>
    </Container>
  );
}
