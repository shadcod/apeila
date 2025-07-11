import { useEffect, useState } from 'react';
import Charts from '@components/dashboard/Charts';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import ErrorDisplay from '@/components/common/ErrorDisplay';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const { error, isLoading, handleAsync } = useErrorHandler();

  const fetchData = async () => {
    await handleAsync(
      async () => {
        const res = await fetch('/data/dashboard.json');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setDashboardData(data);
        return data;
      },
      {
        successMessage: 'Dashboard data loaded successfully',
        showSuccessMessage: false // لا نريد إظهار رسالة نجاح للتحميل العادي
      }
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  return (
    <div>
      <ErrorDisplay 
        error={error} 
        onRetry={fetchData} 
        className="mb-4" 
      />
      
      {dashboardData && <Charts data={dashboardData} />}
    </div>
  );
};

export default DashboardPage;
