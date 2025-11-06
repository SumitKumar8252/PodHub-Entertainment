import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

export default function PodcastCard({ episode }) {
  return (
    <motion.div
      className="card overflow-hidden"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2">{episode.title}</h3>
        <p className="text-sm text-gray-500 mt-1">by {episode.creatorName}</p>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>{(episode.durationSec ?? 0)}s</span>
          <span>{episode.playCount ?? 0} plays</span>
          <span>{episode.commentCount ?? 0} comments</span>
        </div>
        <Link to={`/podcast/${episode._id}`} className="btn btn-primary mt-4 w-full">Listen</Link>
      </div>
    </motion.div>
  );
}
