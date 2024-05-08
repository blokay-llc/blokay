import LoginForm from "./components/LoginForm";
import Providers from "./components/Providers";
export default function Login({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen h-full dark:bg-stone-950">
      <div className="flex items-center justify-center min-h-screen w-full">
        <Providers>
          <LoginForm />
        </Providers>
      </div>
    </div>
  );
}
