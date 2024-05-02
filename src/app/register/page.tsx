import RegisterForm from "./components/RegisterForm";
export default function Login({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen h-full ">
      <div className="flex items-center justify-center min-h-screen w-full">
        <RegisterForm />
      </div>
    </div>
  );
}
