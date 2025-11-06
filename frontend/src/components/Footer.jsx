export default function Footer() {
  return (
    <footer className="mt-10 border-t bg-white">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} PodHub. All rights reserved.</p>
        <p className="text-xs text-gray-400">Built with React, Vite, Tailwind, and Framer Motion.</p>
      </div>
    </footer>
  );
}
