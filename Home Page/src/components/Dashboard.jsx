export default function Dashboard() {
  return (
    <section className="py-16 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-white px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-gray-900 font-semibold text-lg">Dashboard</h3>
              <p className="text-gray-500 text-sm">Welcome back! Here's your business overview.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm border border-gray-200 rounded-lg px-3 py-1.5 whitespace-nowrap">Last 30 days ▾</span>
              <button className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 whitespace-nowrap">
                + New Quote
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6">
            {[
              { label: 'Total Quotes', value: '48', change: '+100.0%', color: 'bg-red-50', icon: '📄' },
              { label: 'Active Bookings', value: '30', change: '+100.0%', color: 'bg-green-50', icon: '📅' },
              { label: 'Revenue (30d)', value: '₹19,17,035', change: '+100.0%', color: 'bg-emerald-50', icon: '📈' },
              { label: 'Total Customers', value: '23', change: '+100.0%', color: 'bg-purple-50', icon: '👥' },
            ].map((card) => (
              <div key={card.label} className={`${card.color} rounded-xl p-3 sm:p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs sm:text-sm">{card.label}</span>
                  <span className="text-lg">{card.icon}</span>
                </div>
                <div className="text-gray-900 text-xl sm:text-2xl font-bold">{card.value}</div>
                <div className="text-green-600 text-xs mt-1">{card.change} vs prev period</div>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-gray-50 rounded-xl p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                <div>
                  <h4 className="text-gray-900 font-medium text-sm">Revenue Overview</h4>
                  <p className="text-gray-500 text-xs">Last 6 months performance</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full inline-block" /> Revenue</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary-300 rounded-full inline-block" /> Profit</span>
                </div>
              </div>
              <div className="h-40 flex items-end justify-around gap-2 px-4">
                {[20, 30, 25, 45, 80, 60, 35, 25].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-primary/60 to-primary/20 rounded-t-md"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-gray-900 font-medium text-sm mb-1">Recent Activity</h4>
              <p className="text-gray-500 text-xs mb-4">Latest quotes and bookings</p>
              <div className="space-y-3">
                {[
                  { id: 'NA-1530-QT', customer: 'aamir khan', amount: '₹1,75,000', status: 'Rejected', statusColor: 'text-red-500' },
                  { id: 'NA-336-25-26', customer: 'aamir khan', amount: '₹78,000', status: '', statusColor: '' },
                  { id: 'NA-1529-QT', customer: 'aamir khan', amount: '₹78,000', status: 'Converted', statusColor: 'text-green-500' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="text-gray-900 text-sm font-medium">{item.id} <span className={`text-xs ${item.statusColor}`}>{item.status}</span></div>
                      <div className="text-gray-500 text-xs">{item.customer}</div>
                    </div>
                    <div className="text-gray-900 text-sm font-medium">{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom charts */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-gray-900 font-medium text-sm">Monthly Bookings</h4>
              <p className="text-gray-500 text-xs mb-4">Booking volume over last 6 months</p>
              <div className="h-24 flex items-end justify-around gap-3 px-2">
                {[8, 12, 6, 18, 32, 14].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t-sm"
                      style={{ height: `${(h / 32) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-gray-900 font-medium text-sm">Financial Summary</h4>
              <p className="text-gray-500 text-xs mb-3">All-time business overview</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">₹</span>
                  <span className="text-gray-600 text-sm">Total Revenue</span>
                  <span className="text-gray-900 font-medium text-sm ml-auto">₹19,17,035</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
