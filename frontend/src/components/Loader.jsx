import { motion as Motion } from "framer-motion";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-10">
      <motion.div
        className="w-10 h-10 rounded-full border-4 border-gray-300 border-t-indigo-600"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <span className="ml-3 text-sm text-gray-600">{label}</span>
    </div>
  );
}
