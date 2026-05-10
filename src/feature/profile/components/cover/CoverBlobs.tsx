export function CoverBlobs() {
  return (
    <>
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 350,
          height: 350,
          left: "-8%",
          top: -80,
          background: "#a855f718",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute rounded-full"
        style={{
          width: 280,
          height: 280,
          right: "-6%",
          top: 30,
          background: "#4096ff12",
          filter: "blur(50px)",
        }}
      />
      <div
        className="pointer-events-none absolute hidden rounded-full md:block"
        style={{
          width: 200,
          height: 200,
          left: "50%",
          top: -30,
          background: "#ec489915",
          filter: "blur(40px)",
        }}
      />
    </>
  );
}
