import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <Link href="/" className="font-display text-xl font-bold text-primary">
          Paper Sherpas
        </Link>
      </div>
    </header>
  );
}
