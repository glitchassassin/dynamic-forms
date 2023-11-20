import { FloatingLabel, Form } from "react-bootstrap";
import { useField } from "remix-validated-form";

interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  readonly name: string;
  readonly label: string;
}

export function TextInput({ name, label, ...rest }: TextInputProps) {
  const { error, getInputProps } = useField(name);
  return (
    <>
      <FloatingLabel label={label} controlId={name}>
        <Form.Control
          isInvalid={error ? true : undefined}
          type="text"
          {...getInputProps(rest)}
        ></Form.Control>
      </FloatingLabel>
      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </>
  );
}
