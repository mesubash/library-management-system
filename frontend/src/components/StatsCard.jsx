export default function StatsCard({ title, value }) {
    return (
      <div className="p-4 bg-white rounded shadow hover:shadow-lg transition-all">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl mt-2">{value}</p>
      </div>
    );
  }
  