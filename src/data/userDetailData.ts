export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'DELIVERED' | 'PENDING' | 'CANCELLED' | 'PROCESSING';
  items: OrderItem[];
  total: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  orderNumber: string;
  date: string;
}

export interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  status: 'active' | 'blocked';
  avatarColor: string;
  totalOrders: number;
  totalSpent: number;
  orders: Order[];
  recentActivity: ActivityItem[];
}

export const userDetailData: UserDetail = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.j@email.com',
  phone: '+1 234 567 8901',
  address: '123 Main St, New York, NY 10001',
  joinDate: '1/15/2024',
  status: 'active',
  avatarColor: '#9333EA',
  totalOrders: 2,
  totalSpent: 94.96,
  orders: [
    {
      id: '1',
      orderNumber: 'ORD-001',
      date: '2026-01-28',
      status: 'DELIVERED',
      items: [
        {
          name: 'Classic Taffy Mix',
          quantity: 2,
          price: 49.98,
        },
        {
          name: 'Strawberry Delight',
          quantity: 1,
          price: 19.99,
        },
      ],
      total: 69.97,
    },
    {
      id: '2',
      orderNumber: 'ORD-003',
      date: '2026-02-04',
      status: 'PENDING',
      items: [
        {
          name: 'Classic Taffy Mix',
          quantity: 1,
          price: 24.99,
        },
      ],
      total: 24.99,
    },
  ],
  recentActivity: [
    {
      id: '1',
      action: 'Placed order',
      orderNumber: 'ORD-001',
      date: '2026-01-28',
    },
    {
      id: '2',
      action: 'Placed order',
      orderNumber: 'ORD-003',
      date: '2026-02-04',
    },
  ],
};
