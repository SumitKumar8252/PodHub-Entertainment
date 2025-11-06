import useFetch from "../hooks/useFetch";
import PodcastCard from "../components/PodcastCard.jsx";
import Loader from "../components/Loader.jsx";

export default function Home() {
  const { data, loading, error } = useFetch("/episodes?sort=latest", [location.pathname]);

  if (loading) return <Loader label="Fetching latest episodes..." />;
  if (error) return <p className="text-red-600">{error}</p>;

  const episodes = data?.episodes || [];

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Discover short & punchy podcasts</h1>
        <p className="text-gray-600 mt-1">All episodes are under 3 minutes.</p>
      </div>
      {episodes.length === 0 ? (
        <p className="text-gray-500">No episodes yet.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {episodes.map((ep) => <PodcastCard key={ep._id} episode={ep} />)}
        </div>
      )}
    </section>
  );
}
