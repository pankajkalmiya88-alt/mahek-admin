export type OrderStatus = 'DELIVERED' | 'IN TRANSIT' | 'PENDING' | 'SHIPPED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
  };
  date: string;
  itemsCount: number;
  total: number;
  status: OrderStatus;
}

export const ordersData: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
    },
    date: '2026-01-28',
    itemsCount: 2,
    total: 69.97,
    status: 'DELIVERED',
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customer: {
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
    },
    date: '2026-02-02',
    itemsCount: 1,
    total: 104.97,
    status: 'IN TRANSIT',
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    customer: {
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
    },
    date: '2026-02-04',
    itemsCount: 1,
    total: 24.99,
    status: 'PENDING',
  },
  {
    id: '4',
    orderNumber: 'ORD-004',
    customer: {
      name: 'Emma Davis',
      email: 'emma.d@email.com',
    },
    date: '2026-02-10',
    itemsCount: 3,
    total: 89.50,
    status: 'SHIPPED',
  },
  {
    id: '5',
    orderNumber: 'ORD-005',
    customer: {
      name: 'James Wilson',
      email: 'james.w@email.com',
    },
    date: '2026-02-12',
    itemsCount: 2,
    total: 145.00,
    status: 'IN TRANSIT',
  },
  {
    id: '6',
    orderNumber: 'ORD-006',
    customer: {
      name: 'Olivia Martinez',
      email: 'olivia.m@email.com',
    },
    date: '2026-02-15',
    itemsCount: 1,
    total: 34.99,
    status: 'DELIVERED',
  },
  {
    id: '7',
    orderNumber: 'ORD-007',
    customer: {
      name: 'William Brown',
      email: 'william.b@email.com',
    },
    date: '2026-02-18',
    itemsCount: 4,
    total: 199.99,
    status: 'PENDING',
  },
  {
    id: '8',
    orderNumber: 'ORD-008',
    customer: {
      name: 'Sophia Garcia',
      email: 'sophia.g@email.com',
    },
    date: '2026-02-20',
    itemsCount: 2,
    total: 78.50,
    status: 'CANCELLED',
  },
];
