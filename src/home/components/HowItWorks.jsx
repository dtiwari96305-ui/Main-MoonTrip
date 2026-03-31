import { Users, FileText, IndianRupee } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: Users,
    title: 'Add Your Customers',
    description: 'Import or create customer profiles with all their travel preferences, passport details, and history in one place.',
  },
  {
    number: '2',
    icon: FileText,
    title: 'Build & Send Quotes',
    description: 'Build beautiful, itemized quotes with services, hotels, and transport. Convert approved quotes to bookings instantly.',
  },
  {
    number: '3',
    icon: IndianRupee,
    title: 'Track & Get Paid',
    description: 'Monitor every rupee with real-time payment tracking, automated reminders, and professional tax invoices your clients will love.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-dark-heading mt-4 mb-4">
            From Chaos to Clarity in Three Steps
          </h2>
          <p className="text-dark-text text-lg max-w-xl mx-auto">
            Stop juggling spreadsheets. Start running your agency with confidence.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-dark-card border border-dark-border rounded-2xl p-8 hover:border-primary/30 transition-colors"
            >
              <span className="text-primary font-serif text-3xl font-semibold">{step.number}</span>
              <div className="mt-4 mb-4">
                <step.icon size={28} className="text-primary" />
              </div>
              <h3 className="text-dark-heading text-lg font-semibold mb-3">{step.title}</h3>
              <p className="text-dark-text text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
