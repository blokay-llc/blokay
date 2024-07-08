import { Layout, Button } from "./Layout";

export default function UserWelcome(context: any) {
  return (
    <Layout>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">
          Welcome {context.name} to blokay!
        </h1>
        <p className="font-light text-neutral-500">
          We are thrilled to welcome you to Blokay, the way you can code like
          hundreds of developers.
        </p>
      </div>

      <Button href="https://blokay.com/docs">Quick introduction</Button>
    </Layout>
  );
}
