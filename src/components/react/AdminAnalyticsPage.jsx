import { AdminAuthProvider } from '../../context/AdminAuthContext.jsx';
import AdminGuard from '../AdminGuard.jsx';
import AnalyticsDashboard from './AnalyticsDashboard.jsx';

export default function AdminAnalyticsPage() {
  return (
    <AdminAuthProvider>
      <AdminGuard>
        <AnalyticsDashboard />
      </AdminGuard>
    </AdminAuthProvider>
  );
}
