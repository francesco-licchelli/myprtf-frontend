import { AdminAuthProvider } from '../../context/AdminAuthContext.jsx';
import AdminGuard from '../AdminGuard.jsx';
import GatewayDashboard from './GatewayDashboard.jsx';

export default function AdminGatewayPage() {
  return (
    <AdminAuthProvider>
      <AdminGuard>
        <GatewayDashboard />
      </AdminGuard>
    </AdminAuthProvider>
  );
}
