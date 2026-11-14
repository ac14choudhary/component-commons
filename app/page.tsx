import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-4xl font-light text-white">Component Commons</h1>
      <p className="mt-3 text-zinc-400">A shared catalog of recreated UI components.</p>
      <Link href="/design-system/collected" className="mt-6 inline-block text-white underline underline-offset-4">Browse components</Link>
    </main>
  );
}
