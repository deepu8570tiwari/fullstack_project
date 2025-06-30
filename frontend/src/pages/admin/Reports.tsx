import { useState } from 'react';
import { Download, FileText, BarChart3, Users, Package } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'financial' | 'operational' | 'user';
  icon: React.ReactNode;
}

const availableReports: Report[] = [
  {
    id: 'financial-summary',
    name: 'Financial Summary',
    description: 'Revenue, expenses, and profit analysis',
    type: 'financial',
    icon: <BarChart3 size={20} />
  },
  {
    id: 'order-analytics',
    name: 'Order Analytics',
    description: 'Order volume, trends, and performance metrics',
    type: 'operational',
    icon: <Package size={20} />
  },
  {
    id: 'user-activity',
    name: 'User Activity Report',
    description: 'User engagement and activity patterns',
    type: 'user',
    icon: <Users size={20} />
  },
  {
    id: 'client-performance',
    name: 'Client Performance',
    description: 'Client order history and revenue contribution',
    type: 'operational',
    icon: <FileText size={20} />
  }
];

function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedReport || !dateRange.startDate || !dateRange.endDate) {
      alert('Please select a report type and date range');
      return;
    }

    setGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate download
    const reportName = availableReports.find(r => r.id === selectedReport)?.name || 'Report';
    console.log(`Generating ${reportName} from ${dateRange.startDate} to ${dateRange.endDate}`);
    
    setGenerating(false);
    alert('Report generated successfully!');
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'operational': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'user': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reports</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Select Report Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableReports.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedReport === report.id
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedReport === report.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {report.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">{report.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{report.description}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 ${getReportTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Date Range</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Report Generation */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Generate Report</h2>
            
            {selectedReport && (
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Selected:</strong> {availableReports.find(r => r.id === selectedReport)?.name}
                </p>
                {dateRange.startDate && dateRange.endDate && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <strong>Period:</strong> {dateRange.startDate} to {dateRange.endDate}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleGenerateReport}
              disabled={!selectedReport || !dateRange.startDate || !dateRange.endDate || generating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Generate & Download</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Quick Reports</h2>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                Today's Orders
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                This Week's Revenue
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                Monthly Summary
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                Client Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;