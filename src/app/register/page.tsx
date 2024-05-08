import RegisterForm from "./components/RegisterForm";
import Providers from "../login/components/Providers";

export default function Login({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen h-full dark:bg-stone-950 ">
      <div className="flex items-center justify-center min-h-screen w-full">
        <Providers>
          <RegisterForm />
        </Providers>
      </div>
    </div>
  );
}
