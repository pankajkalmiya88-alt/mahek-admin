export type UserStatus = 'active' | 'blocked';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  orders: number;
  status: UserStatus;
  avatarColor: string;
}

export const usersData: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 234 567 8901',
    joinDate: '1/15/2024',
    orders: 12,
    status: 'active',
    avatarColor: '#9333EA', // purple
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 234 567 8902',
    joinDate: '2/20/2024',
    orders: 8,
    status: 'active',
    avatarColor: '#9333EA', // purple
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma.d@email.com',
    phone: '+1 234 567 8903',
    joinDate: '11/10/2023',
    orders: 3,
    status: 'blocked',
    avatarColor: '#9333EA', // purple
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.w@email.com',
    phone: '+1 234 567 8904',
    joinDate: '3/5/2024',
    orders: 15,
    status: 'active',
    avatarColor: '#9333EA', // purple
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    email: 'olivia.m@email.com',
    phone: '+1 234 567 8905',
    joinDate: '12/22/2023',
    orders: 6,
    status: 'active',
    avatarColor: '#9333EA', // purple
  },
  {
    id: '6',
    name: 'William Brown',
    email: 'william.b@email.com',
    phone: '+1 234 567 8906',
    joinDate: '1/30/2024',
    orders: 0,
    status: 'blocked',
    avatarColor: '#9333EA', // purple
  },
  {
    id: '7',
    name: 'Sophia Garcia',
    email: 'sophia.g@email.com',
    phone: '+1 234 567 8907',
    joinDate: '2/14/2024',
    orders: 9,
    status: 'active',
    avatarColor: '#9333EA', // purple
  },
  {
    id: '8',
    name: 'Benjamin Lee',
    email: 'benjamin.l@email.com',
    phone: '+1 234 567 8908',
    joinDate: '3/10/2024',
    orders: 4,
    status: 'active',
    avatarColor: '#9333EA', // purple
  },
];
