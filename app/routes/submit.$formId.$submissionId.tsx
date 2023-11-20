import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { IChangeEvent } from "@rjsf/core";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Col, Container, Row } from "react-bootstrap";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import { getFormSchema } from "~/db/formSchema.server";
import { getFormSubmission } from "~/db/formSubmissions.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const formId = params.formId;
  invariant(typeof formId === "string", "Form ID not found.");
  const submissionId = params.submissionId;
  invariant(typeof submissionId === "string", "Form ID not found.");

  const formSchema = await getFormSchema(formId);
  invariant(formSchema !== null, "Form schema not found.");
  const data = (await getFormSubmission(submissionId))?.data;

  return json({
    formId: formSchema._id,
    name: formSchema.name,
    schema: formSchema.schema,
    data,
  });
};

export default function SubmitForm() {
  const { formId, name, schema, data = "{}" } = useLoaderData<typeof loader>();
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
                formData={JSON.parse(data)}
              />
            )}
          </ClientOnly>
        </Col>
      </Row>
    </Container>
  );
}
