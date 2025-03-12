import { IEmployee } from '@/redux/slices/employeeSlice';
import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = IEmployee & {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Pages',
    url: '/dashboard/pages/',
    icon: 'page',
    isActive: false,
    items: [
      {
        title: 'Blogs',
        url: '/dashboard/pages/bloges',
        icon: 'settings',
        items: [
          {
            title: 'Category',
            url: '/dashboard/pages/blogs/category',
            icon: 'category'
          },
          {
            title: 'Blogs',
            url: '/dashboard/pages/blogs/list',
            icon: 'category'
          }
        ]
      },
      {
        title: 'Terms & Conditions',
        url: '/dashboard/pages/termsandconditions',
        icon: 'settings'
      },
      {
        title: 'Privacy Policy',
        url: '/dashboard/pages/privacypolicy',
        icon: 'settings'
      },
      {
        title: 'Refund Policy',
        url: '/dashboard/pages/refundpolicy',
        icon: 'settings'
      },
      {
        title: 'Cancellation Policy',
        url: '/dashboard/pages/cancellationpolicy',
        icon: 'settings'
      }
    ] // No child items
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'General',
        url: '/dashboard/settings/general',
        icon: 'settings'
      }
    ] // No child items
  },
  {
    title: `Home`,
    url: `#`,
    icon: 'home',
    isActive: false,
    items: [
      {
        title: 'Banner',
        url: '/dashboard/homes/banner',
        icon: 'media'
      }
    ]
  },

  {
    title: `Store`,
    url: `#`,
    icon: 'store',
    isActive: false,
    items: [
      {
        title: 'Slider Banner',
        url: '/dashboard/home/sliders',
        icon: 'slider'
      },
      {
        title: 'Best Salling',
        url: '/dashboard/home/sales',
        icon: 'taxs'
      },
      {
        title: 'Banner',
        url: '/dashboard/home/banner',
        icon: 'media'
      },
      {
        title: 'About',
        url: '/dashboard/home/about',
        icon: 'user'
      },
      {
        title: 'Footer',
        url: '/dashboard/home/footer',
        icon: 'userPen'
      },
      {
        title: 'Newsletter',
        url: '/dashboard/home/newsletter',
        icon: 'userPen'
      },
      {
        title: 'Shop Purpose',
        url: '/dashboard/home/shopPurpose',
        icon: 'TermsAndConditions'
      }
    ]
  },
  {
    title: 'Brands',
    url: '/dashboard/brands',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },

  {
    title: 'Categories',
    url: '/dashboard/categories',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Tags',
    url: '/dashboard/tags',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'All Users',
    url: '/dashboard/users',

    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Taxs',
    url: '/dashboard/taxs',
    icon: 'taxs',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Products',
    url: '/dashboard/products',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  {
    title: `Filters`,
    url: `#`,
    icon: 'kanban',
    isActive: false,
    items: [
      {
        title: 'Types',
        url: '/dashboard/filters/types',
        icon: 'userPen'
      },
      {
        title: 'Values',
        url: '/dashboard/filters/values',
        icon: 'userPen'
      }
    ]
  },
  {
    title: 'Faqs',
    url: '/dashboard/faq',
    icon: 'TermsAndConditions',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Promo Codes',
    url: '/dashboard/promocodes',
    icon: 'TermsAndConditions',
    isActive: false,
    items: [] // No child items
  },

  {
    title: `Address`,
    url: `#`,
    icon: 'address',
    isActive: false,
    items: [
      {
        title: 'Countries',
        url: '/dashboard/address/countries',
        icon: 'userPen'
      },
      {
        title: 'States',
        url: '/dashboard/address/states',
        icon: 'userPen'
      },
      {
        title: 'Cities',
        url: '/dashboard/address/cities',
        icon: 'userPen'
      }
    ]
  },
  {
    title: 'Terms and Conditions',
    url: '/dashboard/terms-and-conditions',
    icon: 'TermsAndConditions',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Privacy Policy',
    url: '/dashboard/privacy-policy',
    icon: 'privicypolicy',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Return Policy',
    url: '/dashboard/return-policy',
    icon: 'returnpolicy',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Shipping Policy',
    url: '/dashboard/shipping-policy',
    icon: 'shippingpolicy',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Inventries',
    url: '/dashboard/inventries',
    icon: 'product',
    isActive: false,
    items: [] // No child items
  },
  // {
  //   title: `Home`,
  //   url: `#`,
  //   icon: 'address',
  //   isActive: false,
  //   items: [
  //     {
  //       title: 'Slider',
  //       url: '/dashboard/home/sliders',
  //       icon: 'userPen'
  //     },
  //     {
  //       title: 'Sales',
  //       url: '/dashboard/home/sales',
  //       icon: 'userPen'
  //     },
  //     {
  //       title: 'Banner',
  //       url: '/dashboard/home/banner',
  //       icon: 'userPen'
  //     },
  //     {
  //       title: 'About',
  //       url: '/dashboard/home/about',
  //       icon: 'userPen'
  //     },
  //     {
  //       title: 'Footer',
  //       url: '/dashboard/home/footer',
  //       icon: 'userPen'
  //     },
  //     {
  //       title: 'Newsletter',
  //       url: '/dashboard/home/newsletter',
  //       icon: 'userPen'
  //     }
  //   ]
  // },
  {
    title: `About Us`,
    url: `#`,
    icon: 'address',
    isActive: false,
    items: [
      {
        title: 'Top Banner',
        url: '/dashboard/about-us/top-banner',
        icon: 'userPen'
      },
      {
        title: 'Introduction',
        url: '/dashboard/about-us/intro',
        icon: 'userPen'
      },
      {
        title: 'Vision',
        url: '/dashboard/about-us/vision',
        icon: 'userPen'
      },
      {
        title: 'Bottom banner',
        url: '/dashboard/about-us/bottom-banner',
        icon: 'userPen'
      }
    ]
  },
  {
    title: 'Blogs',
    url: '/dashboard/blogs',
    icon: 'TermsAndConditions',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Testimonial',
    url: '/dashboard/testimonial',
    icon: 'TermsAndConditions',
    isActive: false,
    items: [] // No child items
  }
];
