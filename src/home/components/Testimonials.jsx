import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Handling trips across spreadsheets and WhatsApp groups was becoming confusing for our team. Turidoo helped us bring quotes, bookings, and payments together, and it's much easier to manage now.",
    name: 'Rajesh Mehta',
    role: 'Agency Founder',
    initials: 'RM',
  },
  {
    quote: "Turidoo makes it really easy to see which bookings are paid, pending, or overdue. Everything is visible at a glance, so there's no need to keep checking with clients or matching numbers later.",
    name: 'Karthik Nair',
    role: 'Finance Manager',
    initials: 'KN',
  },
  {
    quote: "Ek hi platform par quotes, booking aur GST invoices isne humara kaam bahut aasan kar diya aur time bhi bach gaya. Team ko sikhane mein bhi koi dikkat nahi hui.",
    name: 'Priya Sharma',
    role: 'Operations Head',
    initials: 'PS',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase">Why Turidoo</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-heading mt-4">
            Built for Every Travel Agency
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-dark-card border border-dark-border rounded-2xl p-8 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="text-primary fill-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-dark-text leading-relaxed flex-1 mb-8">"{t.quote}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dark-border flex items-center justify-center text-dark-heading text-sm font-medium">
                  {t.initials}
                </div>
                <div>
                  <div className="text-dark-heading text-sm font-medium">{t.name}</div>
                  <div className="text-dark-text text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
