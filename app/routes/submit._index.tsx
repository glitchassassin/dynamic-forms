import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { getFormSchemaList } from "~/db/formSchema.server";

export const loader = async () => {
  const formSchemaList = await getFormSchemaList();

  return json({
    formSchemaList,
  });
};

export default function SubmitForm() {
  const { formSchemaList } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Submit Forms</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
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
