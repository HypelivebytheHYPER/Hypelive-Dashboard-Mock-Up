"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import {
  Activity,
  ArchiveRestore,
  BadgeDollarSign,
  BarChart3,
  BrainCircuit,
  Brain,
  Building2,
  Calendar,
  PieChart,
  ChevronRight,
  ClipboardCheck,
  ClipboardMinus,
  Component,
  Cookie,
  Fingerprint,
  FolderDot,
  Folder,
  Gauge,
  GraduationCap,
  Images,
  Key,
  Mail,
  MessageSquare,
  Proportions,
  Settings,
  ShoppingBag,
  SquareCheck,
  SquareKanban,
  StickyNote,
  User,
  Users,
  WalletMinimal,
  type LucideIcon,
  Github,
  RedoDot,
  CreditCard,
  Speech,
  MessageSquareHeart,
  BookA
} from "lucide-react";
import Link from "next/link";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type NavGroup = {
  title: string;
  items: NavItem;
};

type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  isComing?: boolean;
  isDataBadge?: string;
  isNew?: boolean;
  newTab?: boolean;
  items?: NavItem;
}[];

export const navItems: NavGroup[] = [
  {
    title: "Dashboards",
    items: [
      {
        title: "Default",
        href: "/dashboard/default",
        icon: PieChart
      },
      {
        title: "E-commerce",
        href: "#",
        icon: ShoppingBag,
        items: [
          { title: "Dashboard", href: "/dashboard/ecommerce" },
          { title: "Product List", href: "/dashboard/pages/products" },
          { title: "Product Detail", href: "/dashboard/pages/products/1" },
          { title: "Add Product", href: "/dashboard/pages/products/create" },
          { title: "Order List", href: "/dashboard/pages/orders" },
          { title: "Order Detail", href: "/dashboard/pages/orders/detail" }
        ]
      },
      { title: "Sales", href: "/dashboard/sales", icon: BadgeDollarSign },
      { title: "CRM", href: "/dashboard/crm", icon: BarChart3 },
      {
        title: "Website Analytics",
        href: "/dashboard/website-analytics",
        icon: Gauge
      },
      {
        title: "Project Management",
        href: "/dashboard/project-management",
        icon: FolderDot
      },
      {
        title: "File Manager",
        href: "/dashboard/file-manager",
        icon: Folder
      },
      { title: "Crypto", href: "/dashboard/crypto", icon: WalletMinimal },
      { title: "Academy/School", href: "/dashboard/academy", icon: GraduationCap },
      { title: "Hospital Management", href: "/dashboard/hospital-management", icon: Activity },
      { title: "Hotel Dashboard", href: "/dashboard/hotel", icon: Building2, isComing: true },
      {
        title: "Finance Dashboard",
        href: "/dashboard/finance",
        icon: WalletMinimal
      },
      {
        title: "Payment Dashboard",
        href: "/dashboard/payment",
        icon: CreditCard,
        items: [
          { title: "Dashboard", href: "/dashboard/payment" },
          { title: "Transactions", href: "/dashboard/payment/transactions" }
        ]
      }
    ]
  },
  {
    title: "Apps",
    items: [
      {
        title: "Kanban",
        href: "/dashboard/apps/kanban",
        icon: SquareKanban,
        isNew: true
      },
      { title: "Notes", href: "/dashboard/apps/notes", icon: StickyNote, isDataBadge: "8" },
      { title: "Chats", href: "/dashboard/apps/chat", icon: MessageSquare, isDataBadge: "5" },
      {
        title: "Social Media",
        href: "/dashboard/apps/social-media",
        icon: MessageSquareHeart,
        isComing: true
      },
      { title: "Mail", href: "/dashboard/apps/mail", icon: Mail },
      {
        title: "Todo List App",
        href: "/dashboard/apps/todo-list-app",
        icon: SquareCheck
      },
      {
        title: "Tasks",
        href: "/dashboard/apps/tasks",
        icon: ClipboardCheck
      },
      { title: "Calendar", href: "/dashboard/apps/calendar", icon: Calendar },
      {
        title: "File Manager",
        href: "/dashboard/apps/file-manager",
        icon: ArchiveRestore,
        isNew: true
      },
      { title: "Api Keys", href: "/dashboard/apps/api-keys", icon: Key },
      { title: "POS App", href: "/dashboard/apps/pos-system", icon: Cookie },
      { title: "Courses", href: "/dashboard/apps/courses", icon: BookA, isComing: true }
    ]
  },
  {
    title: "AI Apps",
    items: [
      { title: "AI Chat", href: "/dashboard/apps/ai-chat", icon: Brain },
      {
        title: "AI Chat V2",
        href: "/dashboard/apps/ai-chat-v2",
        icon: BrainCircuit,
        isNew: true
      },
      {
        title: "Image Generator",
        href: "/dashboard/apps/ai-image-generator",
        icon: Images
      },
      {
        title: "Text to Speech",
        href: "/dashboard/apps/text-to-speech",
        icon: Speech,
        isComing: true
      }
    ]
  },
  {
    title: "Pages",
    items: [
      {
        title: "Users List",
        href: "/dashboard/pages/users",
        icon: Users
      },
      {
        title: "Profile",
        href: "/dashboard/pages/profile",
        icon: User
      },
      {
        title: "Onboarding Flow",
        href: "/dashboard/pages/onboarding-flow",
        icon: RedoDot
      },
      {
        title: "Empty States",
        href: "/dashboard/pages/empty-states/01",
        icon: Component,
        items: [
          { title: "Empty States 01", href: "/dashboard/pages/empty-states/01" },
          { title: "Empty States 02", href: "/dashboard/pages/empty-states/02" },
          { title: "Empty States 03", href: "/dashboard/pages/empty-states/03" }
        ]
      },
      {
        title: "Settings",
        href: "/dashboard/pages/settings",
        icon: Settings,
        items: [
          { title: "Profile", href: "/dashboard/pages/settings" },
          { title: "Account", href: "/dashboard/pages/settings/account" },
          { title: "Billing", href: "/dashboard/pages/settings/billing" },
          { title: "Appearance", href: "/dashboard/pages/settings/appearance" },
          { title: "Notifications", href: "/dashboard/pages/settings/notifications" },
          { title: "Display", href: "/dashboard/pages/settings/display" }
        ]
      },
      {
        title: "Pricing",
        href: "#",
        icon: BadgeDollarSign,
        items: [
          { title: "Column Pricing", href: "/dashboard/pages/pricing/column" },
          { title: "Table Pricing", href: "/dashboard/pages/pricing/table" },
          { title: "Single Pricing", href: "/dashboard/pages/pricing/single" }
        ]
      },
      {
        title: "Authentication",
        href: "/",
        icon: Fingerprint,
        items: [
          { title: "Login v1", href: "/dashboard/login/v1" },
          { title: "Login v2", href: "/dashboard/login/v2" },
          { title: "Register v1", href: "/dashboard/register/v1" },
          { title: "Register v2", href: "/dashboard/register/v2" },
          { title: "Forgot Password", href: "/dashboard/forgot-password" }
        ]
      },
      {
        title: "Error Pages",
        href: "/",
        icon: Fingerprint,
        items: [
          { title: "404", href: "/dashboard/pages/error/404" },
          { title: "500", href: "/dashboard/pages/error/500" },
          { title: "403", href: "/dashboard/pages/error/403" }
        ]
      }
    ]
  },
  {
    title: "Others",
    items: [
      {
        title: "Download Hypelive Dashboard",
        href: "/pricing",
        icon: ClipboardMinus,
        newTab: true
      },
      {
        title: "Components",
        href: "/components",
        icon: Component,
        newTab: true
      },
      {
        title: "Blocks",
        href: "/blocks",
        icon: Component,
        newTab: true
      },
      {
        title: "Templates",
        href: "/templates",
        icon: Proportions,
        newTab: true
      },
      {
        title: "Github",
        href: "https://github.com/bundui",
        icon: Github,
        newTab: true
      }
    ]
  }
];

export function NavMain() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <>
      {navItems.map((nav) => (
        <SidebarGroup key={nav.title}>
          <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {nav.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {Array.isArray(item.items) && item.items.length > 0 ? (
                    <>
                      <div className="hidden group-data-[collapsible=icon]:block">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                            className="min-w-48 rounded-lg">
                            <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                            {item.items?.map((item) => (
                              <DropdownMenuItem
                                className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10! active:bg-[var(--primary)]/10!"
                                asChild
                                key={item.title}>
                                <a href={item.href}>{item.title}</a>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <Collapsible className="group/collapsible block group-data-[collapsible=icon]:hidden">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                            tooltip={item.title}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item?.items?.map((subItem, key) => (
                              <SidebarMenuSubItem key={key}>
                                <SidebarMenuSubButton
                                  className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                                  isActive={pathname === subItem.href}
                                  asChild>
                                  <Link href={subItem.href} target={subItem.newTab ? "_blank" : ""}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    </>
                  ) : (
                    <SidebarMenuButton
                      className="hover:text-foreground active:text-foreground hover:bg-[var(--primary)]/10 active:bg-[var(--primary)]/10"
                      isActive={pathname === item.href}
                      tooltip={item.title}
                      asChild>
                      <Link href={item.href} target={item.newTab ? "_blank" : ""}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                  {!!item.isComing && (
                    <SidebarMenuBadge className="peer-hover/menu-button:text-foreground opacity-50">
                      Coming
                    </SidebarMenuBadge>
                  )}
                  {!!item.isNew && (
                    <SidebarMenuBadge className="border border-green-400 text-green-600 peer-hover/menu-button:text-green-600">
                      New
                    </SidebarMenuBadge>
                  )}
                  {!!item.isDataBadge && (
                    <SidebarMenuBadge className="peer-hover/menu-button:text-foreground">
                      {item.isDataBadge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
