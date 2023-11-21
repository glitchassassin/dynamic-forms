import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import invariant from "tiny-invariant";
import { getFormSchema } from "~/db/formSchema.server";
import {
  listFormSubmissions,
  setFormSubmission,
} from "~/db/formSubmissions.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const formId = params.formId;
  invariant(typeof formId === "string", "Form ID not found.");

  const formSchema = await getFormSchema(formId);
  invariant(formSchema !== null, "Form schema not found.");

  const submissions = await listFormSubmissions(formId);

  return json({
    formId: formSchema._id,
    name: formSchema.name,
    submissions,
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
  const { formId, name, submissions } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/results">View Results</Breadcrumb.Item>
            <Breadcrumb.Item active>Submissions for {name}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1>Submissions for {name}</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ul>
            {submissions.map((submission) => (
              <li key={submission._id}>
                <a href={`/results/${formId}/${submission._id}`}>
                  {submission._id}
                </a>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
