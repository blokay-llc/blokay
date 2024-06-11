import { Layout, Button } from "./Layout";

export default function ForgotPassword(context: any) {
  return (
    <Layout>
      <div>
        <img
          src="https://blokay.com/logo.svg"
          alt="Blokay"
          className="h-12 mx-auto mb-10"
        />
      </div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">
          Hi {context.name}, Reset your password
        </h1>
        <p className="font-light text-neutral-500">
          We received a request to reset your password. Please click the link
          below to set a new password:
        </p>
      </div>

      <Button href={"https://app.blokay.com/recoverpassword/" + context.token}>
        Change password
      </Button>

      <p className="mt-5">
        If you didn't request this, please ignore this email.
      </p>
    </Layout>
  );
}
