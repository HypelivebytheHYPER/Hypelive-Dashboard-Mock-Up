type PageRoutesType = {
  title: string;
  items: PageRoutesItemType;
};

type PageRoutesItemType = {
  title: string;
  href: string;
  icon?: string;
  isComing?: boolean;
  items?: PageRoutesItemType;
}[];

export const page_routes: PageRoutesType[] = [
  {
    title: "Dashboards",
    items: [
      {
        title: "KOL Discovery",
        href: "/dashboard/kol-discovery",
        icon: "Users2"
      },
      {
        title: "Default",
        href: "/dashboard/default",
        icon: "LayoutDashboard"
      },
      {
        title: "CRM",
        href: "/dashboard/crm",
        icon: "Users"
      },
      {
        title: "E-commerce",
        href: "/dashboard/ecommerce",
        icon: "ShoppingCart"
      },
      {
        title: "Finance",
        href: "/dashboard/finance",
        icon: "DollarSign"
      },
      {
        title: "Crypto",
        href: "/dashboard/crypto",
        icon: "Bitcoin"
      },
      {
        title: "Sales",
        href: "/dashboard/sales",
        icon: "TrendingUp"
      },
      {
        title: "Project Management",
        href: "/dashboard/project-management",
        icon: "FolderKanban"
      },
      {
        title: "Website Analytics",
        href: "/dashboard/website-analytics",
        icon: "BarChart3"
      },
      {
        title: "Logistics",
        href: "/dashboard/logistics",
        icon: "Truck"
      },
      {
        title: "Academy",
        href: "/dashboard/academy",
        icon: "GraduationCap"
      },
      {
        title: "Hospital Management",
        href: "/dashboard/hospital-management",
        icon: "Heart"
      },
      {
        title: "Hotel",
        href: "/dashboard/hotel",
        icon: "Hotel"
      }
    ]
  },
  {
    title: "Applications",
    items: [
      {
        title: "AI Chat",
        href: "/dashboard/apps/ai-chat",
        icon: "Bot"
      },
      {
        title: "AI Chat V2",
        href: "/dashboard/apps/ai-chat-v2",
        icon: "MessageCircle"
      },
      {
        title: "AI Image Generator",
        href: "/dashboard/apps/ai-image-generator",
        icon: "Image"
      },
      {
        title: "Text to Speech",
        href: "/dashboard/apps/text-to-speech",
        icon: "Volume2"
      },
      {
        title: "Calendar",
        href: "/dashboard/apps/calendar",
        icon: "Calendar"
      },
      {
        title: "Kanban",
        href: "/dashboard/apps/kanban",
        icon: "Columns3"
      },
      {
        title: "Mail",
        href: "/dashboard/apps/mail",
        icon: "Mail"
      },
      {
        title: "Chat",
        href: "/dashboard/apps/chat",
        icon: "MessageSquare"
      },
      {
        title: "File Manager",
        href: "/dashboard/apps/file-manager",
        icon: "FolderOpen"
      },
      {
        title: "Notes",
        href: "/dashboard/apps/notes",
        icon: "StickyNote"
      },
      {
        title: "Tasks",
        href: "/dashboard/apps/tasks",
        icon: "CheckSquare"
      },
      {
        title: "Todo List",
        href: "/dashboard/apps/todo-list-app",
        icon: "ListTodo"
      },
      {
        title: "Social Media",
        href: "/dashboard/apps/social-media",
        icon: "Share2"
      },
      {
        title: "Courses",
        href: "/dashboard/apps/courses",
        icon: "BookOpen"
      },
      {
        title: "POS System",
        href: "/dashboard/apps/pos-system",
        icon: "CreditCard"
      },
      {
        title: "API Keys",
        href: "/dashboard/apps/api-keys",
        icon: "Key"
      }
    ]
  },
  {
    title: "Pages",
    items: [
      {
        title: "Users",
        href: "/dashboard/pages/users",
        icon: "Users"
      },
      {
        title: "Settings",
        href: "/dashboard/pages/settings",
        icon: "Settings"
      },
      {
        title: "File Manager",
        href: "/dashboard/file-manager",
        icon: "FolderTree"
      },
      {
        title: "Payment",
        href: "/dashboard/payment",
        icon: "CreditCard"
      },
      {
        title: "Authentication",
        href: "/",
        icon: "Shield",
        items: [
          { title: "Login", href: "/login" },
          { title: "Register", href: "/register" }
        ]
      },
      {
        title: "Error Pages",
        href: "/",
        icon: "AlertCircle",
        items: [
          { title: "404", href: "/pages/error/404" },
          { title: "500", href: "/pages/error/500" }
        ]
      }
    ]
  }
];
