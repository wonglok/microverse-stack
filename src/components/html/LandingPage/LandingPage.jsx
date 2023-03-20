import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="w-full h-full">
      <div>Welcome to our metaverse</div>
      <Link to="/smooth">Smooth</Link>
      <Link to="/quality">Quality</Link>
    </div>
  );
}
