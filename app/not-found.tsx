import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

      <h2 className="text-2xl font-semibold mb-2">
        Page Not Found
      </h2>

      <p className="text-base-content/70 mb-6 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/"
        className="btn btn-primary rounded-lg px-6"
      >
        Go Back Home
      </Link>
    </div>
  );
}
