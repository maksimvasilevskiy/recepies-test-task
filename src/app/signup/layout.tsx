export default function SignUpPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex mt-[64px] ml-auto mr-auto">
        {children}
      </div>
    </>
  );
}
