import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Remix Dynamic Forms</h1>
      <ul>
        <li>
          <Link to="/edit/">
            Edit Schema
          </Link>
        </li>
        <li>
          <Link to="/submit/">
            Submit Form
          </Link>
        </li>
        <li>
          <Link to="/resuilts/">
            View Results
          </Link>
        </li>
      </ul>
    </div>
  );
}
