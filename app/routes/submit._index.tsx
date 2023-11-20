import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Col, Container, Row } from "react-bootstrap";
import invariant from "tiny-invariant";
import { getFormSchemaList } from "~/db/formSchema.server";
import { setFormSubmission } from "~/db/formSubmissions.server";

export const loader = async () => {
  const formSchemaList = await getFormSchemaList();

  return json({
    formSchemaList,
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = formData.get("data");
  const formId = formData.get("formId");
  invariant(typeof data === "string", "Form data not found.");
  invariant(typeof formId === "string", "Form ID not found.");

  setFormSubmission({
    schema: formId,
    data: data,
  });

  return json({ data });
};

export default function SubmitForm() {
  const { formSchemaList } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Row>
        <Col>
          <h1>Select Form</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <ul>
            {formSchemaList.map((form) => (
              <li key={form._id}>
                <Link to={`/submit/${form._id}`}>{form.name}</Link>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
