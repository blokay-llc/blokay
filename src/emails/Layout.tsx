import {
  Tailwind,
  Button as ButtonReact,
  Container,
} from "@react-email/components";

export function Button({ children, ...props }: any) {
  return (
    <ButtonReact
      className="bg-black px-3 py-2 font-light leading-4 text-white rounded-lg shadow-md"
      {...props}
    >
      {children}
    </ButtonReact>
  );
}

export function Layout({ children }: any) {
  return (
    <Tailwind>
      <div className=" pt-10">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
          <div className="bg-white rounded-lg  text-black  px-10 text-center border border-neutral-200">
            <div className="py-10">{children}</div>
            <div className="w-full h-1 bg-neutral-200 mb-3 "></div>
            <div className=" pb-5  text-sm font-light   text-neutral-500">
              Blokay - All rights reserved
            </div>
          </div>
        </Container>
      </div>
    </Tailwind>
  );
}
