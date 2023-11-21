import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { IChangeEvent } from "@rjsf/core";
import { type RJSFSchema } from "@rjsf/utils";
import { useEffect, useState } from "react";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import { ClientOnly } from "remix-utils/client-only";
import invariant from "tiny-invariant";
import { CustomForm } from "~/components/CustomForm";
import { getFormSchema, setFormSchema } from "~/db/formSchema.server";
import { serverValidator } from "~/validation/index.server";

const schema: RJSFSchema = {
  title: "Edit form",
  description: "Edit the schema for the form",
  type: "object",
  required: ["name", "schema"],
  properties: {
    name: {
      type: "string",
      title: "Form Name",
    },
    schema: {
      type: "string",
      title: "Schema",
    },
    uiSchema: {
      type: "string",
      title: "UI Schema",
    },
    id: {
      type: "string",
      title: "ID",
    },
  },
};

const uiSchema = {
  name: {
    "ui:autofocus": true,
  },
  schema: {
    "ui:enableMarkdownInDescription": true,
    "ui:description":
      "Paste the form's [JSON schema](https://rjsf-team.github.io/react-jsonschema-form/docs/json-schema/)",
    "ui:widget": "textarea",
  },
  uiSchema: {
    "ui:enableMarkdownInDescription": true,
    "ui:description":
      "Paste the form's [UI schema](https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema/)",
    "ui:widget": "textarea",
  },
  id: {
    "ui:widget": "hidden",
  },
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const formId = params.formId;
  invariant(typeof formId === "string", "Form ID not found.");

  // load form from MongoDB
  const result = await getFormSchema(formId);

  return json({
    id: result?._id ?? "",
    name: result?.name ?? "",
    schema: result?.schema ?? "",
    uiSchema: result?.uiSchema ?? "",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = await request.formData();
  const data = result.get("data");

  invariant(typeof data === "string", "Form data not found.");
  const parsed = JSON.parse(data);

  const validated = serverValidator.validateFormData(parsed, schema);
  if (validated.errors?.length) {
    return json({ errorSchema: validated.errorSchema }, { status: 400 });
  }

  const formSchema = await setFormSchema({
    _id: parsed.id,
    name: parsed.name,
    schema: parsed.schema,
    uiSchema: parsed.uiSchema,
  });

  if (formSchema === null) {
    return json({ error: "Failed to save form." }, { status: 500 });
  }

  return redirect(`/edit/${formSchema._id}`);
};

export default function EditSchema() {
  const initialFormData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const [formData, setFormData] = useState<typeof initialFormData | undefined>(
    initialFormData
  );
  const [extraErrors, setExtraErrors] = useState<any>();
  const onSubmit = ({ formData }: IChangeEvent) => {
    fetcher.submit({ data: JSON.stringify(formData) }, { method: "POST" });
    setExtraErrors(undefined);
  };

  useEffect(() => {
    if (fetcher.data && "errorSchema" in fetcher.data) {
      setExtraErrors(fetcher.data.errorSchema);
    }
  }, [fetcher.data]);

  return (
    <Container>
      <Row>
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
            <Breadcrumb.Item href="/edit">Edit Forms</Breadcrumb.Item>
            <Breadcrumb.Item active>Edit {formData?.name}</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row>
        <Col>
          <ClientOnly>
            {() => (
              <CustomForm
                method="post"
                schema={schema}
                uiSchema={uiSchema}
                formData={formData}
                onChange={({ formData }) => setFormData(formData)}
                extraErrors={extraErrors}
                onSubmit={onSubmit}
                noHtml5Validate={true}
                disabled={fetcher.state !== "idle"}
              />
            )}
          </ClientOnly>
        </Col>
      </Row>
    </Container>
  );
}
