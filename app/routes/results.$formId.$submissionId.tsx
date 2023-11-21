import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
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
    name: formSchema.name,
    submissionId,
    data,
  });
};

export default function SubmitForm() {
  const { name, submissionId, data = {} } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/results">View Results</Breadcrumb.Item>
            <Breadcrumb.Item active>
              View {name}: {submissionId}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>
            View {name}: {submissionId}
          </h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </Col>
      </Row>
    </Container>
  );
}
