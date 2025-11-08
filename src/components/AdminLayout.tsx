import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Users, LayoutDashboard, Image, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/articles', label: 'Articles', icon: FileText },
    { path: '/admin/import', label: 'Import Articles', icon: Upload },
    { path: '/admin/media', label: 'Media Library', icon: Image },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border bg-card min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Back to Site</span>
              </Link>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
