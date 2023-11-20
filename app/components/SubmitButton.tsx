import type { ButtonProps} from "react-bootstrap";
import { Button, Spinner } from "react-bootstrap";

interface SubmitButtonProps extends ButtonProps {
  readonly label?: string;
  readonly variant?: string;
  readonly loading?: boolean;
}

export function SubmitButton({ label, variant, loading, ...rest }: SubmitButtonProps) {
  return (
    <Button variant={variant ?? "primary"} disabled={loading} type="submit" {...rest}>
      {label}
      {loading && (
        <Spinner animation="border" role="status" size="sm">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
    </Button>
  );
}
