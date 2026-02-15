import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ClipboardList, Users, Target, ShieldCheck } from 'lucide-react';
import { ROUTE_PATHS, EMPLOYEES } from '@/lib/index';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              to={ROUTE_PATHS.HOME} 
              className="flex items-center gap-2 group"
            >
              <div className="p-1.5 rounded bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold tracking-tight text-foreground leading-none">
                  TLCA
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground">
                  The Register
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <div className="h-8 w-px bg-border mx-4" />
              {EMPLOYEES.map((employee) => (
                <NavLink
                  key={employee.id}
                  to={ROUTE_PATHS.EMPLOYEE.replace(':slug', employee.slug)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${ 
                      isActive 
                        ? 'bg-accent text-accent-foreground shadow-sm' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
                  <Users className="w-4 h-4" />
                  {employee.name}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <NavLink
              to={ROUTE_PATHS.ORDER_HISTORY}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all border ${ 
                  isActive 
                    ? 'bg-secondary text-secondary-foreground border-secondary' 
                    : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground'
                }`
              }
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Order History</span>
            </NavLink>
            
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase">
                Authorized Access
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="border-t border-border bg-card py-6 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span>Copyright 2026 TLCA Gun Register</span>
            <span className="hidden md:inline">-</span>
            <span>Station Inventory System v2.4.0</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono text-muted-foreground uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              System Secure
            </span>
            <span>Ledger Validated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
