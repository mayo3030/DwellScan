'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import {
  LayoutDashboard, Calendar, MessageSquare, FileText, Settings, LogOut,
  Users, DollarSign, Shield, ClipboardList, Search, MapPin, Star,
  Bell, Menu, X, Scan, Building2, BarChart3,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';
import { logoutUser } from '@/app/actions/auth';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

const NAV_ITEMS: Record<string, NavItem[]> = {
  CLIENT: [
    { label: 'Overview', href: '/client', icon: LayoutDashboard },
    { label: 'Addresses', href: '/client/addresses', icon: MapPin },
    { label: 'Bookings', href: '/client/bookings', icon: ClipboardList },
    { label: 'AI Scans', href: '/client/ai-scans', icon: Scan },
    { label: 'Messages', href: '/client/messages', icon: MessageSquare },
    { label: 'Reports', href: '/client/reports', icon: FileText },
    { label: 'Settings', href: '/client/settings', icon: Settings },
  ],
  INSPECTOR: [
    { label: 'Overview', href: '/inspector', icon: LayoutDashboard },
    { label: 'Profile', href: '/inspector/profile', icon: Users },
    { label: 'Service Area', href: '/inspector/service-area', icon: MapPin },
    { label: 'Availability', href: '/inspector/availability', icon: Calendar },
    { label: 'Bookings', href: '/inspector/bookings', icon: ClipboardList },
    { label: 'Messages', href: '/inspector/messages', icon: MessageSquare },
    { label: 'Earnings', href: '/inspector/earnings', icon: DollarSign },
    { label: 'Reviews', href: '/inspector/reviews', icon: Star },
    { label: 'Documents', href: '/inspector/documents', icon: FileText },
    { label: 'Settings', href: '/inspector/settings', icon: Settings },
  ],
  REALTOR: [
    { label: 'Overview', href: '/realtor', icon: LayoutDashboard },
    { label: 'Clients', href: '/realtor/clients', icon: Users },
    { label: 'Bookings', href: '/realtor/bookings', icon: ClipboardList },
    { label: 'Commissions', href: '/realtor/commissions', icon: DollarSign },
    { label: 'Payout History', href: '/realtor/payouts', icon: BarChart3 },
    { label: 'Settings', href: '/realtor/settings', icon: Settings },
  ],
  ADMIN: [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Inspectors', href: '/admin/inspectors', icon: Shield },
    { label: 'Bookings', href: '/admin/bookings', icon: ClipboardList },
    { label: 'Payouts', href: '/admin/payouts', icon: DollarSign },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Disputes', href: '/admin/disputes', icon: FileText },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: BarChart3 },
  ],
};

function SidebarLogo() {
  return (
    <svg viewBox="0 0 40 40" fill="none" className="h-7 w-7" aria-label="DwellScan">
      <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
      <path d="M12 28V16L20 10L28 16V28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
      <rect x="17" y="21" width="6" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
    </svg>
  );
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = NAV_ITEMS[user.role] || [];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border/50 bg-sidebar transition-transform duration-300 ease-out lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
          <SidebarLogo />
          <span className="font-display text-lg font-semibold tracking-wide text-foreground">DwellScan</span>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-0.5 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-primary ml-0'
                      : 'text-sidebar-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', isActive ? 'text-primary' : '')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* User section */}
        <div className="border-t border-border/50 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 px-2 hover:bg-accent/50">
                <Avatar className="h-8 w-8 border border-primary/20">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium text-foreground">{user.firstName} {user.lastName}</span>
                  <span className="text-xs text-muted-foreground capitalize">{user.role.toLowerCase()}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground">{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/${user.role.toLowerCase()}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => logoutUser()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Search className="mr-2 h-4 w-4" />
              Find Inspectors
            </Button>
          </Link>
          <Link href={`/${user.role.toLowerCase()}/messages`}>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
          </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
