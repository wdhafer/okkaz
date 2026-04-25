import Link from "next/link";

type LogoProps = {
  href?: string;
};

export default function Logo({ href = "/" }: LogoProps) {
  return (
    <Link href={href} className="brand" aria-label="OKKAZ accueil">
      <span className="brand-symbol" aria-hidden="true">
        <span className="brand-tag-hole" />
        <span className="brand-spark" />
      </span>
      <span className="brand-word">
        OKKAZ
        <span className="brand-sub">AI resale desk</span>
      </span>
    </Link>
  );
}
