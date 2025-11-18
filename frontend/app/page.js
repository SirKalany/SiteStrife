import Link from "next/link";
import Carousel from "@/components/carousel";

const domains = [
  { name: "Air", path: "/air", img: "/airimage.jpg" },
  { name: "Naval", path: "/naval", img: "/navalimage.jpg" },
  { name: "Ground", path: "/ground", img: "/groundimage.jpg" },
  { name: "Infantry", path: "/infantry", img: "/infantryimage.jpg" },
  { name: "Heavy", path: "/heavy", img: "/heavyimage.jpg" },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#1b1b1b]">
      <Carousel />

      <div className="absolute top-6 w-full text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-yellow-500 tracking-wide drop-shadow-lg">
          Military Equipment Database
        </h1>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="flex gap-6 mb-8">
          {domains.slice(0, 3).map(({ name, path, img }, index) => (
            <DomainButton
              key={name}
              name={name}
              path={path}
              img={img}
              index={index}
            />
          ))}
        </div>

        <div className="flex gap-6">
          {domains.slice(3).map(({ name, path, img }, index) => (
            <DomainButton
              key={name}
              name={name}
              path={path}
              img={img}
              index={index + 3}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

/* Bouton réutilisable */
function DomainButton({ name, path, img, index }) {
  return (
    <Link
      href={path}
      className="group relative w-96 h-72"
      style={{ transform: `skew(-10deg, 0deg)` }}
    >
      <div
        className="absolute inset-0 bg-center bg-cover transition-all duration-300 group-hover:scale-105 border border-gray-600 group-hover:border-yellow-500"
        style={{
          backgroundImage: `url('${img}')`,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-br from-black/70 via-transparent to-black/90 group-hover:from-green-900/40 group-hover:to-black/80 transition-all duration-300" />

        <div
          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div
        className="relative h-full flex flex-col justify-center items-center"
        style={{ transform: `skew(10deg, 0deg)` }}
      >
        <div className="text-center">
          <div className="text-xs text-yellow-500 font-mono mb-1 opacity-80 group-hover:opacity-100">
            [ DOMAIN {String(index + 1).padStart(2, "0")} ]
          </div>
          <span className="text-3xl font-bold text-white tracking-wider group-hover:text-yellow-500 transition-colors">
            {name.toUpperCase()}
          </span>
          <div className="mt-1 text-sm text-gray-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
            &gt; ACCESS_GRANTED
          </div>
        </div>

        <div
          className="absolute top-2 right-2 w-3 h-3 bg-yellow-500 opacity-60 group-hover:opacity-100 transition-opacity"
          style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
        />
      </div>
    </Link>
  );
}
