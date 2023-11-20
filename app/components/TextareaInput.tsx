import { FloatingLabel, Form } from "react-bootstrap";
import { useField } from "remix-validated-form";

interface TextareaInputProps extends React.HTMLProps<HTMLTextAreaElement> {
  readonly name: string;
  readonly label: string;
}

export function TextareaInput({ name, label, ...rest }: TextareaInputProps) {
  const { error, getInputProps } = useField(name);
  return (
    <FloatingLabel label={label} controlId={name}>
      <Form.Control
        as="textarea"
        isInvalid={error ? true : undefined}
        {...getInputProps(rest)}
        style={{ height: "400px" }}
      ></Form.Control>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </FloatingLabel>
  );
}
