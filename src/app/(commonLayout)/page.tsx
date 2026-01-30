import { Button } from "@/components/ui/button";

export default async function Home() {
  const res = await fetch("http://localhost:5000/api/auth/get-session");
  return (
    <div className="m-3">
      <Button>Click Here</Button>
    </div>
  );
}
