import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { IChangeEvent } from "@rjsf/core";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import { CustomForm } from "~/components/CustomForm";
import { getFormSchema } from "~/db/formSchema.server";
import {
  getFormSubmission,
  setFormSubmission,
} from "~/db/formSubmissions.server";

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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = formData.get("data");
  const formId = formData.get("formId");
  invariant(typeof data === "string", "Form data not found.");
  invariant(typeof formId === "string", "Form ID not found.");

  const submission = await setFormSubmission({
    schema: formId,
    data: JSON.parse(data),
  });

  if (submission) return redirect(`/submit/${formId}/${submission._id}`);

  console.log("could not find submission");

  return null;
};

export default function SubmitForm() {
  const { formId, name, schema, data = {} } = useLoaderData<typeof loader>();
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
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/submit">Submit Forms</Breadcrumb.Item>
            <Breadcrumb.Item active>Submit {name}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>Submit {name}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ClientOnly>
            {() => (
              <CustomForm
                method="post"
                schema={JSON.parse(schema)}
                onSubmit={onSubmit}
                formData={data}
              />
            )}
          </ClientOnly>
        </Col>
      </Row>
    </Container>
  );
}
