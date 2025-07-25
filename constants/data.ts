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
    title: 'Home',
    url: '/dashboard/homes',
    icon: 'home',
    isActive: false,
    items: [
      {
        title: 'Slider',
        url: '/dashboard/homes/banner',
        icon: 'slider'
      },
      {
        title: 'Config',
        url: '/dashboard/homes/config',
        icon: 'config'
      },
      {
        title: 'Why Choose',
        url: '/dashboard/homes/whyChoose',
        icon: 'whyChoose'
      },
      {
        title: 'Our Service',
        url: '/dashboard/homes/ourServices',
        icon: 'ourService'
      },
      {
        title: 'Consultance',
        url: '/dashboard/homes/consultance',
        icon: 'consultance'
      },
      {
        title: 'Kundli',
        url: '/dashboard/homes/kundli',
        icon: 'atom'
      },
      {
        title: 'Vibhor',
        url: '/dashboard/homes/vibhor',
        icon: 'atom'
      },
      {
        title: 'Testimonial',
        url: '/dashboard/homes/testimonial',
        icon: 'message'
      }
      // {
      //   title: 'News Letter',
      //   url: '/dashboard/homes/newsletter',
      //   icon: 'settings'
      // }
    ]
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
            icon: 'chartCandlestick'
          }
        ]
      },
      {
        title: 'Categories',
        url: '/dashboard/store/categories',
        icon: 'categories'
      },
      {
        title: 'Brands',
        url: '/dashboard/store/brands',
        icon: 'medal'
      },
      {
        title: 'Tags',
        url: '/dashboard/store/tags',
        icon: 'tag'
      },
      {
        title: 'Tax',
        url: '/dashboard/store/taxs',
        icon: 'tax'
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
            url: '/dashboard/store/others/store-sliders',
            icon: 'slider'
          },
          {
            title: 'Best Selling',
            url: '/dashboard/store/others/best-selling',
            icon: 'taxs'
          },
          // {
          //   title: 'Shop By Purpose',
          //   url: '/dashboard/store/others/shop-purpose',
          //   icon: 'goal'
          // },
          {
            title: 'Store Banner',
            url: '/dashboard/store/others/store-banner',
            icon: 'thumbnails'
          },
          {
            title: 'About',
            url: '/dashboard/store/others/about',
            icon: 'squareUser'
          },
          {
            title: 'Gallery',
            url: '/dashboard/store/others/gallery',
            icon: 'media'
          },
          {
            title: 'Config',
            url: '/dashboard/store/others/config',
            icon: 'config'
          }
        ]
      }
    ]
  },
  {
    title: 'Address',
    url: '/dashboard/address',
    icon: 'mapPinned',
    isActive: false,
    items: [
      {
        title: 'Cities',
        url: '/dashboard/address/cities',
        icon: 'city'
      },
      {
        title: 'Countries',
        url: '/dashboard/address/countries',
        icon: 'earth'
      },
      {
        title: 'States',
        url: '/dashboard/address/states',
        icon: 'mapHome'
      }
    ]
  },
  {
    title: 'Astro Pooja',
    url: '/dashboard/astro-pooja',
    icon: 'temple',
    isActive: false,
    items: [
      {
        title: 'list',
        url: '/dashboard/astro-pooja/list',
        icon: 'list'
      },
      {
        title: 'Other',
        url: '/dashboard/astro-pooja/other',
        isActive: false,
        icon: 'otherlist',
        items: [
          {
            title: 'Config',
            url: '/dashboard/astro-pooja/other/config',
            icon: 'config'
          }
        ]
      }
    ]
  },
  {
    title: 'Vastu-shastr',
    url: '/dashboard/vastu-shastr',
    icon: 'temple',
    isActive: false,
    items: [
      {
        title: 'list',
        url: '/dashboard/vastu-shastr/list',
        icon: 'list'
      },
      {
        title: 'Config',
        url: '/dashboard/vastu-shastr/config',
        icon: 'list'
      }
    ]
  },
  {
    title: 'Vibhor',
    url: '/dashboard/vibhor',
    icon: 'temple',
    isActive: false,
    items: [
      {
        title: 'Packages',
        url: '/dashboard/vibhor/vibhorpackage',
        icon: 'general'
      },
      {
        title: 'Other',
        url: '/dashboard/vibhor/other',
        isActive: false,
        icon: 'otherlist',
        items: [
          {
            title: 'Config',
            url: '/dashboard/vibhor/other/config',
            icon: 'config'
          }
        ]
      }
    ]
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: 'medal',
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Blogs',
    url: '/dashboard/blogs',
    icon: 'notepadDash',
    isActive: false,
    items: [
      {
        title: 'Categories',
        url: '/dashboard/blogs/categories',
        icon: 'categories'
      },
      {
        title: 'List',
        url: '/dashboard/blogs/list',
        icon: 'list'
      },
      {
        title: 'Other',
        url: '/dashboard/blogs/other',
        icon: 'otherlist',
        isActive: false,
        items: [
          {
            title: 'Config',
            url: '/dashboard/blogs/other/config',
            icon: 'config'
          }
        ]
      }
    ]
  },
  {
    title: 'Horoscope',
    url: '/dashboard/horoscope',
    icon: 'omega',
    isActive: false,
    items: [
      {
        title: 'Testimonial',
        url: '/dashboard/horoscope/testimonial',
        icon: 'message'
      },
      {
        title: 'Signs',
        url: '/dashboard/horoscope/signs',
        icon: 'consultance'
      },
      {
        title: 'Other',
        url: '/dashboard/horoscope/other',
        icon: 'otherlist',
        isActive: false,
        items: [
          {
            title: 'Config',
            url: '/dashboard/horoscope/other/config',
            icon: 'config'
          }
        ]
      }
    ]
  },
  {
    title: 'Calendar',
    url: '/dashboard/calendar-data',
    icon: 'settings',
    items: [
      {
        title: 'Config',
        url: '/dashboard/calendar-data/config',
        icon: 'tableContents'
      },
      {
        title: 'Other',
        url: '/dashboard/calendar-data',
        icon: 'config',
        isActive: false,
        items: [
          {
            title: 'Calender Events',
            url: '/dashboard/calendar-data/others/calendar',
            icon: 'tableContents'
          }
        ]
      }
    ]
  },
  {
    title: 'Kundli',
    url: '/dashboard/kundli',
    icon: 'atom',
    isActive: false,
    items: [
      {
        title: "FAQ's",
        url: '/dashboard/kundli/faq',
        icon: 'tableContents'
      },
      {
        title: 'List',
        url: '/dashboard/kundli/list',
        icon: 'list'
      },
      {
        title: 'Other',
        url: '/dashboard/kundli/other',
        icon: 'otherlist',
        isActive: false,
        items: [
          {
            title: 'Config',
            url: '/dashboard/kundli/other/config',
            icon: 'config'
          }
        ]
      }
    ]
  },
  {
    title: 'Match Making',
    url: '/dashboard/matchmaking',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'List',
        url: '/dashboard/matchmaking/list',
        icon: 'list'
      },
      {
        title: 'Other',
        url: '/dashboard/matchmaking/others',
        icon: 'general',
        isActive: false,
        items: [
          {
            title: 'Config',
            url: '/dashboard/matchmaking/others/config',
            icon: 'general'
          },
          {
            title: 'Testimonial',
            url: '/dashboard/matchmaking/others/testimonial',
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
        title: 'Approved',
        url: '/dashboard/astrologers/approved',
        icon: 'general'
      },
      {
        title: 'Rejected',
        url: '/dashboard/astrologers/rejected',
        icon: 'general'
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
    title: 'Consultation',
    url: '/dashboard/Consultation',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Config',
        url: '/dashboard/Consultation/Config',
        icon: 'general'
      }
    ]
  },
  {
    title: 'Contacts',
    url: '/dashboard/contact',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Message List',
        url: '/dashboard/contact/list',
        icon: 'general',
        isActive: false
      },
      {
        title: 'Config',
        url: '/dashboard/contact/config',
        icon: 'general',
        isActive: false
      }
    ]
  },
  // {
  //   title: 'Feedbacks',
  //   url: '/dashboard/feedbacks',
  //   icon: 'settings',
  //   isActive: false,
  //   items: [
  //     {
  //       title: 'By User',
  //       url: '/dashboard/feedbacks/by-user',
  //       icon: 'general'
  //     },
  //     {
  //       title: 'By Astrologer',
  //       url: '/dashboard/feedbacks/by-astrologer',
  //       icon: 'general'
  //     }
  //   ]
  // },
  // {
  //   title: 'Contact Us',
  //   url: '/dashboard/contact-us',
  //   icon: 'settings',
  //   isActive: false,
  //   items: [
  //     {
  //       title: 'By User',
  //       url: '/dashboard/contact-us/by-user',
  //       icon: 'general'
  //     },
  //     {
  //       title: 'By Astrologer',
  //       url: '/dashboard/contact-us/by-astrologer',
  //       icon: 'general'
  //     }
  //   ]
  // },
  // {
  //   title: 'Writer Consultant',
  //   url: '/dashboard/writer-consultant',
  //   icon: 'settings',
  //   isActive: false,
  //   items: [
  //     {
  //       title: 'Packages',
  //       url: '/dashboard/writer-consultant/packages',
  //       icon: 'general'
  //     },
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/writer-consultant/profile',
  //       icon: 'general'
  //     },
  //     {
  //       title: 'Config',
  //       url: '/dashboard/writer-consultant/config',
  //       icon: 'general'
  //     },
  //     {
  //       title: 'Testimonial',
  //       url: '/dashboard/writer-consultant/testimonial',
  //       icon: 'general'
  //     },
  //     {
  //       title: "FAQ's",
  //       url: '/dashboard/writer-consultant/faqs',
  //       icon: 'general'
  //     }
  //   ]
  // },
  {
    title: 'Career Forms',
    url: '/dashboard/carrier-forms',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'List',
        url: '/dashboard/carrier-forms/list',
        icon: 'general'
      },
      {
        title: 'Config',
        url: '/dashboard/carrier-forms/config',
        icon: 'general'
      }
    ]
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
        title: 'Vibhor',
        url: '/dashboard/orders/vibhor-packages',
        icon: 'general'
      }
    ]
  },
  // {
  //   title: 'Consultancy History',
  //   url: '/dashboard/consultancy-history',
  //   icon: 'settings'
  // },
  // {
  //   title: 'User List',
  //   url: '/dashboard/user-list',
  //   icon: 'user',
  //   isActive: false,
  //   items: [
  //     {
  //       title: 'Wallet',
  //       url: '/dashboard/user-list/wallet',
  //       icon: 'general'
  //     },
  //     {
  //       title: 'Order History',
  //       url: '/dashboard/user-list/order-history',
  //       icon: 'general'
  //     },
  //     {
  //       title: 'Address',
  //       url: '/dashboard/user-list/address',
  //       icon: 'general'
  //     }
  //   ]
  // },
  {
    title: 'News letter subscribers',
    url: '/dashboard/newsletter',
    icon: 'settings'
  },
  {
    title: 'Admin support',
    url: '/dashboard/admin-support',
    icon: 'settings'
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: 'settings',
    isActive: false,
    items: [
      {
        title: 'Expertise',
        url: '/dashboard/settings/expertise',
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
            title: 'Refund Policy',
            url: '/dashboard/settings/pages/refund-policy',
            icon: 'general'
          },
          {
            title: 'Cancel & Return Policy',
            url: '/dashboard/settings/pages/cancel-return-policy',
            icon: 'general'
          },
          {
            title: 'About Us',
            url: '/dashboard/settings/pages/about',
            icon: 'general'
          },
          {
            title: 'Feedback',
            url: '/dashboard/settings/pages/feedback',
            icon: 'general',
            isActive: false,
            items: [
              {
                title: 'Form',
                url: '/dashboard/settings/pages/feedback/form',
                icon: 'general'
              },
              {
                title: 'Config',
                url: '/dashboard/settings/pages/feedback/config',
                icon: 'general'
              }
            ]
          },
          {
            title: "FAQ's",
            url: '/dashboard/settings/pages/project-faq',
            icon: 'general',
            isActive: false,
            items: [
              {
                title: 'Config',
                url: '/dashboard/settings/pages/project-faq/config',
                icon: 'general'
              },
              {
                title: 'List',
                url: '/dashboard/settings/pages/project-faq/FAQ',
                icon: 'general'
              }
            ]
          },
          {
            title: 'Astrologer Policy',
            url: '/dashboard/settings/pages/astrologer-policy',
            icon: 'general'
          },
          {
            title: 'Astrologer Config',
            url: '/dashboard/settings/pages/astroregisterconfig',
            icon: 'general'
          },
          {
            title: 'Why Choose',
            url: '/dashboard/settings/pages/whyChoose',
            icon: 'general'
          },
          {
            title: 'Sale Config',
            url: '/dashboard/settings/pages/sale-config',
            icon: 'general'
          },
          {
            title: 'Download Section',
            url: '/dashboard/settings/pages/download-section',
            icon: 'general'
          }
        ]
      },
      {
        title: 'Promo code',
        url: '/dashboard/settings/pages/promocodes',
        icon: 'general'
      },
      {
        title: 'General',
        url: '/dashboard/settings/general',
        icon: 'general'
      },
      // {
      //   title: 'Website',
      //   url: '/dashboard/settings/website',
      //   icon: 'general'
      // },
      // {
      //   title: 'App',
      //   url: '/dashboard/settings/app',
      //   icon: 'general'
      // },

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
  }
];
