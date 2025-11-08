import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Users, LayoutDashboard, Image, Upload, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/articles', label: 'Articles', icon: FileText },
    { path: '/admin/import', label: 'Import Articles', icon: Upload },
    { path: '/admin/media', label: 'Media Library', icon: Image },
    { path: '/admin/users', label: 'Users', icon: Users },
  ];

  const NavigationItems = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <Link
        to="/"
        className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        onClick={onItemClick}
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
            onClick={onItemClick}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Mobile Header */}
      {isMobile && (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-foreground mb-6">Admin Panel</h2>
                  <nav className="space-y-2">
                    <NavigationItems onItemClick={() => setMobileMenuOpen(false)} />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            
            <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
            
            <Link to="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>
      )}

      <div className="flex w-full">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="sticky top-0 h-screen w-56 border-r border-border bg-card overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Admin Panel</h2>
              <nav className="space-y-2">
                <NavigationItems />
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
