import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Container } from "react-bootstrap";

export const meta: MetaFunction = () => {
  return [
    { title: "Dynamic Forms" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <Container>
      <h1>Remix Dynamic Forms</h1>
      <ul>
        <li>
          <Link to="/edit/">Edit Forms</Link>
        </li>
        <li>
          <Link to="/submit/">Submit Forms</Link>
        </li>
        <li>
          <Link to="/resuilts/">View Results</Link>
        </li>
      </ul>
    </Container>
  );
}
