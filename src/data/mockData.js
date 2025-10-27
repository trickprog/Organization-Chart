export const mockEmployees = [
  // CEO Level
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Chief Executive Officer",
    department: "Executive",
    email: "sarah.johnson@company.com",
    phone: "+1-555-0101",
    location: "New York HQ",
    managerId: null,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c133adf0?w=150&h=150&fit=crop&crop=face",
    joinDate: "2018-01-15",
    skills: ["Leadership", "Strategy", "Business Development"]
  },
  
  // C-Level Executives
  {
    id: 2,
    name: "Michael Chen",
    title: "Chief Technology Officer",
    department: "Technology",
    email: "michael.chen@company.com",
    phone: "+1-555-0102",
    location: "San Francisco",
    managerId: 1,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "2019-03-20",
    skills: ["Technology Strategy", "Software Architecture", "Team Leadership"]
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Chief Human Resources Officer",
    department: "Human Resources",
    email: "emily.rodriguez@company.com",
    phone: "+1-555-0103",
    location: "New York HQ",
    managerId: 1,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    joinDate: "2018-06-10",
    skills: ["HR Strategy", "Talent Management", "Organizational Development"]
  },
  {
    id: 4,
    name: "David Thompson",
    title: "Chief Financial Officer",
    department: "Finance",
    email: "david.thompson@company.com",
    phone: "+1-555-0104",
    location: "New York HQ",
    managerId: 1,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    joinDate: "2019-08-01",
    skills: ["Financial Planning", "Investment Strategy", "Risk Management"]
  },
  {
    id: 5,
    name: "Lisa Park",
    title: "Chief Marketing Officer",
    department: "Marketing",
    email: "lisa.park@company.com",
    phone: "+1-555-0105",
    location: "Los Angeles",
    managerId: 1,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    joinDate: "2020-02-15",
    skills: ["Brand Strategy", "Digital Marketing", "Customer Analytics"]
  },

  // Engineering Team
  {
    id: 6,
    name: "Alex Kumar",
    title: "VP of Engineering",
    department: "Technology",
    email: "alex.kumar@company.com",
    phone: "+1-555-0106",
    location: "San Francisco",
    managerId: 2,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinDate: "2020-01-10",
    skills: ["Software Engineering", "System Design", "Agile Management"]
  },
  {
    id: 7,
    name: "Rachel Green",
    title: "Senior Software Engineer",
    department: "Technology",
    email: "rachel.green@company.com",
    phone: "+1-555-0107",
    location: "San Francisco",
    managerId: 6,
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    joinDate: "2021-05-20",
    skills: ["React", "Node.js", "Database Design"]
  },
  {
    id: 8,
    name: "James Wilson",
    title: "Software Engineer",
    department: "Technology",
    email: "james.wilson@company.com",
    phone: "+1-555-0108",
    location: "Remote",
    managerId: 6,
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    joinDate: "2022-03-15",
    skills: ["Python", "Machine Learning", "API Development"]
  },
  {
    id: 9,
    name: "Maria Garcia",
    title: "DevOps Engineer",
    department: "Technology",
    email: "maria.garcia@company.com",
    phone: "+1-555-0109",
    location: "Austin",
    managerId: 6,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    joinDate: "2021-11-08",
    skills: ["AWS", "Docker", "Kubernetes"]
  },

  // HR Team
  {
    id: 10,
    name: "Robert Lee",
    title: "HR Manager",
    department: "Human Resources",
    email: "robert.lee@company.com",
    phone: "+1-555-0110",
    location: "New York HQ",
    managerId: 3,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    joinDate: "2020-07-12",
    skills: ["Recruitment", "Employee Relations", "Performance Management"]
  },
  {
    id: 11,
    name: "Jennifer Adams",
    title: "HR Specialist",
    department: "Human Resources",
    email: "jennifer.adams@company.com",
    phone: "+1-555-0111",
    location: "New York HQ",
    managerId: 10,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    joinDate: "2022-01-20",
    skills: ["Onboarding", "Training", "HR Analytics"]
  },
  {
    id: 12,
    name: "Tom Harris",
    title: "Recruiter",
    department: "Human Resources",
    email: "tom.harris@company.com",
    phone: "+1-555-0112",
    location: "Chicago",
    managerId: 10,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "2021-09-05",
    skills: ["Technical Recruiting", "Talent Sourcing", "Interview Coordination"]
  },

  // Finance Team
  {
    id: 13,
    name: "Amanda Brown",
    title: "Finance Manager",
    department: "Finance",
    email: "amanda.brown@company.com",
    phone: "+1-555-0113",
    location: "New York HQ",
    managerId: 4,
    avatar: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face",
    joinDate: "2021-02-28",
    skills: ["Financial Analysis", "Budgeting", "Forecasting"]
  },
  {
    id: 14,
    name: "Kevin Zhang",
    title: "Financial Analyst",
    department: "Finance",
    email: "kevin.zhang@company.com",
    phone: "+1-555-0114",
    location: "New York HQ",
    managerId: 13,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    joinDate: "2022-06-15",
    skills: ["Excel", "SQL", "Data Analysis"]
  },
  {
    id: 15,
    name: "Sophie Miller",
    title: "Accountant",
    department: "Finance",
    email: "sophie.miller@company.com",
    phone: "+1-555-0115",
    location: "New York HQ",
    managerId: 13,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    joinDate: "2020-11-10",
    skills: ["Accounting", "Tax Preparation", "Audit Support"]
  },

  // Marketing Team
  {
    id: 16,
    name: "Carlos Mendez",
    title: "Marketing Manager",
    department: "Marketing",
    email: "carlos.mendez@company.com",
    phone: "+1-555-0116",
    location: "Los Angeles",
    managerId: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    joinDate: "2021-04-18",
    skills: ["Content Marketing", "SEO", "Social Media"]
  },
  {
    id: 17,
    name: "Hannah Davis",
    title: "Digital Marketing Specialist",
    department: "Marketing",
    email: "hannah.davis@company.com",
    phone: "+1-555-0117",
    location: "Remote",
    managerId: 16,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c133adf0?w=150&h=150&fit=crop&crop=face",
    joinDate: "2022-08-22",
    skills: ["Google Ads", "Facebook Marketing", "Analytics"]
  },
  {
    id: 18,
    name: "Nathan Cooper",
    title: "Content Creator",
    department: "Marketing",
    email: "nathan.cooper@company.com",
    phone: "+1-555-0118",
    location: "Los Angeles",
    managerId: 16,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    joinDate: "2022-02-14",
    skills: ["Video Production", "Graphic Design", "Copywriting"]
  },

  // Sales Team
  {
    id: 19,
    name: "Victoria Scott",
    title: "VP of Sales",
    department: "Sales",
    email: "victoria.scott@company.com",
    phone: "+1-555-0119",
    location: "Chicago",
    managerId: 1,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    joinDate: "2019-12-03",
    skills: ["Sales Strategy", "Client Relations", "Team Leadership"]
  },
  {
    id: 20,
    name: "Mark Johnson",
    title: "Sales Manager",
    department: "Sales",
    email: "mark.johnson@company.com",
    phone: "+1-555-0120",
    location: "Chicago",
    managerId: 19,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    joinDate: "2021-01-25",
    skills: ["B2B Sales", "CRM", "Lead Generation"]
  },
  {
    id: 21,
    name: "Laura White",
    title: "Sales Representative",
    department: "Sales",
    email: "laura.white@company.com",
    phone: "+1-555-0121",
    location: "Remote",
    managerId: 20,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    joinDate: "2022-05-30",
    skills: ["Cold Calling", "Product Demos", "Customer Support"]
  },
  {
    id: 22,
    name: "Daniel Kim",
    title: "Sales Representative",
    department: "Sales",
    email: "daniel.kim@company.com",
    phone: "+1-555-0122",
    location: "Seattle",
    managerId: 20,
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    joinDate: "2021-12-01",
    skills: ["Enterprise Sales", "Negotiation", "Account Management"]
  }
];

// Helper function to build organization hierarchy
export const buildOrgHierarchy = (employees) => {
  const employeeMap = new Map();
  const hierarchy = [];

  // Create a map of all employees
  employees.forEach(employee => {
    employeeMap.set(employee.id, { ...employee, subordinates: [] });
  });

  // Build the hierarchy
  employees.forEach(employee => {
    if (employee.managerId === null) {
      // This is a top-level employee (CEO)
      hierarchy.push(employeeMap.get(employee.id));
    } else {
      // This employee reports to someone
      const manager = employeeMap.get(employee.managerId);
      if (manager) {
        manager.subordinates.push(employeeMap.get(employee.id));
      }
    }
  });

  return hierarchy;
};
