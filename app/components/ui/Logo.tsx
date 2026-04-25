import Link from "next/link";

type LogoProps = {
  href?: string;
};

export default function Logo({ href = "/" }: LogoProps) {
  return (
    <Link href={href} className="brand" aria-label="OKKAZ accueil">
      <span className="brand-symbol" aria-hidden="true">
        O
      </span>
      <span className="brand-word">
        OKKAZ
      </span>
    </Link>
  );
}
