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
    title: `Store`,
    url: `#`,
    icon: 'store',
    isActive: false,
    items: [
      {
        title: 'Filters',
        url: '/dashboard/store/filters',
        icon: 'filter',
        isActive: false,
        items: [
          {
            title: 'Types',
            url: '/dashboard/store/filters/types',
            icon: 'type'
          },
          {
            title: 'Values',
            url: '/dashboard/store/filters/values',
            icon: 'filter'
          }
        ]
      },
      {
        title: 'Categories',
        url: '/dashboard/store/categories',
        icon: 'categories'
      },
      {
        title: 'Products',
        url: '/dashboard/store/products',
        icon: 'basket'
      },
      {
        title: 'Inventory',
        url: '/dashboard/store/inventory',
        icon: 'notepad'
      },
      {
        title: "FAQ's",
        url: '/dashboard/store/faqs',
        icon: 'tableContents'
      },
      {
        title: 'Testimonial',
        url: '/dashboard/store/testimonial',
        icon: 'message'
      },
      {
        title: 'Others',
        url: `/dashboard/store/others`,
        icon: 'otherlist',
        isActive: false,
        items: [
          {
            title: 'Store Sliders',
            url: '/dashboard/store/other/store-sliders',
            icon: 'slider'
          },
          {
            title: 'Best Selling',
            url: '/dashboard/store/other/best-selling',
            icon: 'taxs'
          },
          {
            title: 'Store Banner',
            url: '/dashboard/store/other/store-banner',
            icon: 'media'
          },
          {
            title: 'Config',
            url: '/dashboard/store/other/config',
            icon: 'config'
          }
        ]
      }
      // {
      //   title: 'Slider Banner',
      //   url: '/dashboard/home/sliders',
      //   icon: 'slider'
      // },
      // {
      //   title: 'Best Salling',
      //   url: '/dashboard/home/sales',
      //   icon: 'taxs'
      // },
      // {
      //   title: 'Store Config',
      //   url: '/dashboard/store/config',
      //   icon: 'config'
      // },
      // {
      //   title: 'Banner',
      //   url: '/dashboard/home/banner',
      //   icon: 'media'
      // },
      // {
      //   title: 'About',
      //   url: '/dashboard/home/about',
      //   icon: 'user'
      // },
      // {
      //   title: 'Footer',
      //   url: '/dashboard/home/footer',
      //   icon: 'userPen'
      // },
      // {
      //   title: 'Newsletter',
      //   url: '/dashboard/home/newsletter',
      //   icon: 'userPen'
      // },
      // {
      //   title: 'FAQ',
      //   url: '/dashboard/home/faq',
      //   icon: 'userPen'
      // },
      // {
      //   title: 'Shop Purpose',
      //   url: '/dashboard/home/shopPurpose',
      //   icon: 'TermsAndConditions'
      // },
      // {
      //   title: 'Gallery Image',
      //   url: '/dashboard/home/galleryImage',
      //   icon: 'TermsAndConditions'
      // }
    ]
  },
  {
    title: 'Astro Pooja',
    url: '/dashboard/astro-pooja',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'List',
        url: '/dashboard/astro-pooja/list',
        icon: 'general'
      },
      {
        title: 'Other',
        url: '/dashboard/astro-pooja/other',
        isActive: false,
        icon: 'general',
        items: [
          {
            title: 'Config',

            url: '/dashboard/astro-pooja/other/config',
            icon: 'general'
          }
        ]
      }
    ]
  },
  {
    title: 'Blog',
    url: '/dashboard/blog',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Categories',
        url: '/dashboard/blog/categories',
        icon: 'general'
      },
      {
        title: 'List',
        url: '/dashboard/blog/list',
        icon: 'general'
      },
      {
        title: 'Other',
        url: '/dashboard/blog/other',
        icon: 'general',
        isActive: false,
        items: [
          {
            title: 'Config',
            url: '/dashboard/blog/other/config',
            icon: 'general'
          }
        ]
      }
    ]
  },
  {
    title: 'Horoscope',
    url: '/dashboard/horoscope',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Testimonial',
        url: '/dashboard/horoscope/testimonial',
        icon: 'general'
      },
      {
        title: "FAQ's",
        url: '/dashboard/horoscope/faqs',
        icon: 'general'
      },
      {
        title: 'Signs',
        url: '/dashboard/horoscope/signs',
        icon: 'general',
        isActive: false,
        items: [
          {
            title: 'Aries',
            url: '/dashboard/horoscope/signs/aries',
            icon: 'general'
          }
        ]
      },
      {
        title: 'Other',
        url: '/dashboard/horoscope/other',
        icon: 'general',
        isActive: false,
        items: [
          {
            title: 'Config',
            url: '/dashboard/horoscope/other/config',
            icon: 'general'
          }
        ]
      }
    ]
  },
  {
    title: 'Kundli',
    url: '/dashboard/kundli',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: "FAQ's",
        url: '/dashboard/kundli/faq',
        icon: 'general'
      },
      {
        title: 'Testimonial',
        url: '/dashboard/kundli/testimonial',
        icon: 'general'
      },
      {
        title: 'Other',
        url: '/dashboard/kundli/other',
        icon: 'general',
        isActive: false,
        items: [
          {
            title: 'Config',
            url: '/dashboard/kundli/other/config',
            icon: 'general'
          }
        ]
      }
    ]
  },
  {
    title: 'Match Making',
    url: '/dashboard/match-making',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: "FAQ's",
        url: '/dashboard/match-making/faqs',
        icon: 'general'
      },
      {
        title: 'Testimonial',
        url: '/dashboard/match-making/testimonial',
        icon: 'general'
      },
      {
        title: 'Other',
        url: '/dashboard/match-making/other',
        icon: 'general',
        isActive: false,
        items: [
          {
            title: 'Config',
            url: '/dashboard/match-making/other/config',
            icon: 'general'
          }
        ]
      }
    ]
  },
  {
    title: 'Astrologers',
    url: '/dashboard/astrologers',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Requested',
        url: '/dashboard/astrologers/requested',
        icon: 'general'
      },
      {
        title: 'List',
        url: '/dashboard/astrologers/list',
        icon: 'general',
        isActive: false,
        items: [
          {
            title: 'Profiles',
            url: '/dashboard/astrologers/list/profiles',
            icon: 'general'
          },
          {
            title: 'Packages',
            url: '/dashboard/astrologers/list/packages',
            icon: 'general'
          },
          {
            title: 'Availability',
            url: '/dashboard/astrologers/list/availability',
            icon: 'general'
          },
          {
            title: 'Rating',
            url: '/dashboard/astrologers/list/rating',
            icon: 'general'
          },
          {
            title: 'Followers',
            url: '/dashboard/astrologers/list/followers',
            icon: 'general'
          },
          {
            title: 'History',
            url: '/dashboard/astrologers/list/history',
            icon: 'general'
          }
        ]
      }
    ]
  },
  {
    title: 'Panchang',
    url: '/dashboard/panchang',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: "FAQ's",
        url: '/dashboard/panchang/faqs',
        icon: 'general'
      },
      {
        title: 'Testimonial',
        url: '/dashboard/panchang/testimonial',
        icon: 'general'
      },
      {
        title: 'Other',
        url: '/dashboard/panchang/other',
        icon: 'general',
        isActive: false,
        items: [
          {
            title: 'Config',
            url: '/dashboard/panchang/other/config',
            icon: 'general'
          }
        ]
      }
    ]
  },
  {
    title: 'Feedbacks',
    url: '/dashboard/feedbacks',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'By User',
        url: '/dashboard/feedbacks/by-user',
        icon: 'general'
      },
      {
        title: 'By Astrologer',
        url: '/dashboard/feedbacks/by-astrologer',
        icon: 'general'
      }
    ]
  },
  {
    title: 'Contact Us',
    url: '/dashboard/contact-us',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'By User',
        url: '/dashboard/contact-us/by-user',
        icon: 'general'
      },
      {
        title: 'By Astrologer',
        url: '/dashboard/contact-us/by-astrologer',
        icon: 'general'
      }
    ]
  },
  {
    title: 'News Letter',
    url: '/dashboard/news-letter',
    icon: 'settings'
  },
  {
    title: 'Writer Consultant',
    url: '/dashboard/writer-consultant',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Packages',
        url: '/dashboard/writer-consultant/packages',
        icon: 'general'
      },
      {
        title: 'Profile',
        url: '/dashboard/writer-consultant/profile',
        icon: 'general'
      },
      {
        title: 'Config',
        url: '/dashboard/writer-consultant/config',
        icon: 'general'
      },
      {
        title: 'Testominal',
        url: '/dashboard/writer-consultant/testominal',
        icon: 'general'
      },
      {
        title: "FAQ's",
        url: '/dashboard/writer-consultant/faqs',
        icon: 'general'
      }
    ]
  },
  {
    title: 'Career Forms',
    url: '/dashboard/career-forms',
    icon: 'settings'
  },
  {
    title: 'Orders',
    url: '/dashboard/orders',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Store',
        url: '/dashboard/orders/store',
        icon: 'general'
      },
      {
        title: 'Pooja',
        url: '/dashboard/orders/pooja',
        icon: 'general'
      },
      {
        title: 'Written Consultancy',
        url: '/dashboard/orders/written-consultancy',
        icon: 'general'
      }
    ]
  },
  {
    title: 'Consultancy History',
    url: '/dashboard/consultancy-history',
    icon: 'settings'
  },
  {
    title: 'User List',
    url: '/dashboard/user-list',
    icon: 'user',
    isActive: false,
    items: [
      {
        title: 'Wallet',
        url: '/dashboard/user-list/wallet',
        icon: 'general'
      },
      {
        title: 'Order History',
        url: '/dashboard/user-list/order-history',
        icon: 'general'
      },
      {
        title: 'Address',
        url: '/dashboard/user-list/address',
        icon: 'general'
      }
    ]
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
        icon: 'general'
      },
      {
        title: 'Website',
        url: '/dashboard/settings/website',
        icon: 'general'
      },
      {
        title: 'App',
        url: '/dashboard/settings/app',
        icon: 'general'
      },
      {
        title: 'Pages',
        url: '/dashboard/settings/pages',
        icon: 'general',
        items: [
          {
            title: 'Terms & Conditions',
            url: '/dashboard/settings/pages/terms-and-conditions',
            icon: 'general'
          },
          {
            title: 'Privacy Policy',
            url: '/dashboard/settings/pages/privacy-policy',
            icon: 'general'
          },
          {
            title: 'Shipping Policy',
            url: '/dashboard/settings/pages/shipping-policy',
            icon: 'general'
          },
          {
            title: 'Cancel & Return Policy',
            url: '/dashboard/settings/pages/cancel-return-policy',
            icon: 'general'
          },
          {
            title: 'About Us',
            url: '/dashboard/settings/pages/about-us',
            icon: 'general'
          },
          {
            title: "FAQ's",
            url: '/dashboard/settings/pages/faqs',
            icon: 'general'
          },
          {
            title: 'Astrologer Policy',
            url: '/dashboard/settings/pages/astrologer-policy',
            icon: 'general'
          }
        ]
      },
      {
        title: 'Languages',
        url: '/dashboard/settings/languages',
        icon: 'general'
      },
      {
        title: 'Expertise',
        url: '/dashboard/settings/expertise',
        icon: 'general'
      }
    ]
  },
  {
    title: 'Pages',
    url: '/dashboard/pages/',
    icon: 'pages',
    isActive: false,
    items: [
      {
        title: 'Blogs',
        url: '/dashboard/pages/bloges',
        icon: 'tableContents',
        items: [
          {
            title: 'Category',
            url: '/dashboard/pages/blogs/category',
            icon: 'categories'
          },
          {
            title: 'Blogs',
            url: '/dashboard/pages/blogs/list',
            icon: 'categories'
          }
        ]
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
          },
          {
            title: 'Config',
            url: '/dashboard/homes/config',
            icon: 'config'
          }
        ]
      },
      {
        title: 'Terms & Conditions',
        url: '/dashboard/pages/termsandconditions',
        icon: 'handshake'
      },
      {
        title: 'Privacy Policy',
        url: '/dashboard/pages/privacypolicy',
        icon: 'privicypolicy'
      },
      {
        title: 'Refund Policy',
        url: '/dashboard/pages/refundpolicy',
        icon: 'returnpolicy'
      },
      {
        title: 'Cancellation Policy',
        url: '/dashboard/pages/cancellationpolicy',
        icon: 'cancel'
      },
      {
        title: 'Shipping Policy',
        url: '/dashboard/pages/shippingpolicy',
        icon: 'settings'
      }
    ]
  },

  {
    title: 'Pages',
    url: '/dashboard/pages/',
    icon: 'pages',
    isActive: false,
    items: [
      {
        title: 'Blogs',
        url: '/dashboard/pages/bloges',
        icon: 'tableContents',
        items: [
          {
            title: 'Category',
            url: '/dashboard/pages/blogs/category',
            icon: 'categories'
          },
          {
            title: 'Blogs',
            url: '/dashboard/pages/blogs/list',
            icon: 'categories'
          }
        ]
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
          },
          {
            title: 'Config',
            url: '/dashboard/homes/config',
            icon: 'config'
          }
        ]
      },
      {
        title: 'Terms & Conditions',
        url: '/dashboard/pages/termsandconditions',
        icon: 'handshake'
      },
      {
        title: 'Privacy Policy',
        url: '/dashboard/pages/privacypolicy',
        icon: 'privicypolicy'
      },
      {
        title: 'Refund Policy',
        url: '/dashboard/pages/refundpolicy',
        icon: 'returnpolicy'
      },
      {
        title: 'Cancellation Policy',
        url: '/dashboard/pages/cancellationpolicy',
        icon: 'cancel'
      },
      {
        title: 'Shipping Policy',
        url: '/dashboard/pages/shippingpolicy',
        icon: 'settings'
      }
    ]
  },
  //----
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
    icon: 'handshake',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Promo Codes',
    url: '/dashboard/promocodes',
    icon: 'handshake',
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
    icon: 'handshake',
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
  }
];
