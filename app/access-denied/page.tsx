import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-9xl font-extrabold text-red-500/80">403</h1>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Access Denied
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Sorry, you don't have permission to access this page. Please make sure you are logged in or contact an administrator.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-colors"
          >
            Go back home
          </Link>
          <Link
            href="/sign-in"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
