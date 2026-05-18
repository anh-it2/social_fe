export function CoverBlobs() {
  return (
    <>
      <div
        className="pointer-events-none absolute rounded-full w-[350px] h-[350px] left-[-8%] top-[-80px] bg-[#a855f718] [filter:blur(60px)]"  />
      <div
        className="pointer-events-none absolute rounded-full w-[280px] h-[280px] right-[-6%] top-[30px] bg-[#4096ff12] [filter:blur(50px)]"  />
      <div
        className="pointer-events-none absolute hidden rounded-full md:block w-[200px] h-[200px] left-[50%] top-[-30px] bg-[#ec489915] [filter:blur(40px)]"  />
    </>
  );
}
