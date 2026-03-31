const stats = [
  { value: '0', label: 'Spreadsheets' },
  { value: '5 min', label: 'Quick Setup' },
  { value: '100%', label: 'GST Compliant' },
];

export default function Stats() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center sm:divide-x divide-dark-border gap-8 sm:gap-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-8 sm:px-16 text-center">
              <div className="text-3xl sm:text-4xl font-serif text-dark-heading mb-1">
                {stat.value}
              </div>
              <div className="text-dark-text text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
