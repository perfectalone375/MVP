import Link from "next/link";
import {
  FileText,
  Mic,
  ShieldCheck,
  Search,
  Video,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume parsing & matching",
    text: "Upload a PDF resume, extract structured data with AI, and match candidates to the right jobs.",
  },
  {
    icon: Mic,
    title: "AI interviews",
    text: "Record answers, get automatic transcripts, and receive scores for domain knowledge, communication and behaviour.",
  },
  {
    icon: ShieldCheck,
    title: "Fraud detection",
    text: "A risk score highlights suspicious profiles so recruiters can trust who they shortlist.",
  },
  {
    icon: Search,
    title: "Candidate search",
    text: "Recruiters search and rank candidates by ATP score, skills and fit for each role.",
  },
  {
    icon: Video,
    title: "Live video meetings",
    text: "Run interviews in built-in video rooms with an AI assistant overlay.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    text: "Dashboards for recruiters and job seekers to track progress and hiring performance.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-black dark:text-zinc-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="text-lg font-semibold tracking-tight">AI Hiring Platform</span>
        <nav className="flex items-center gap-3 text-sm font-medium">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-white dark:text-black dark:hover:bg-zinc-300"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
          <p className="mb-4 inline-block rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            MVP · AI-powered recruiting
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Hire faster. Get hired fairly.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            One platform that parses resumes, runs AI interviews, checks for fraud and
            combines everything into a single candidate score, so recruiters shortlist
            with confidence and job seekers get objective feedback.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="w-full rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 sm:w-auto dark:bg-white dark:text-black dark:hover:bg-zinc-300"
            >
              I&apos;m a job seeker
            </Link>
            <Link
              href="/login"
              className="w-full rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium hover:bg-zinc-100 sm:w-auto dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              I&apos;m a recruiter
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800"
              >
                <Icon className="mb-4 h-6 w-6" aria-hidden="true" />
                <h2 className="text-base font-semibold">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800">
        © {new Date().getFullYear()} AI Hiring Platform
      </footer>
    </div>
  );
}
