export type TrackingStatus = 'Order Placed' | 'Processing' | 'Shipped' | 'In Transit' | 'Delivered';

export interface TrackingStep {
  id: string;
  status: TrackingStatus;
  timestamp: string;
  completed: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
}

export interface OrderDetail {
  orderNumber: string;
  placedDate: string;
  status: string;
  tracking: TrackingStep[];
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export const orderDetailData: OrderDetail = {
  orderNumber: 'ORD-001',
  placedDate: '2026-01-28',
  status: 'Delivered',
  tracking: [
    {
      id: '1',
      status: 'Order Placed',
      timestamp: '2026-01-28 10:30 AM',
      completed: true,
    },
    {
      id: '2',
      status: 'Processing',
      timestamp: '2026-01-28 02:15 PM',
      completed: true,
    },
    {
      id: '3',
      status: 'Shipped',
      timestamp: '2026-01-29 09:00 AM',
      completed: true,
    },
    {
      id: '4',
      status: 'In Transit',
      timestamp: '2026-01-30 08:30 AM',
      completed: true,
    },
    {
      id: '5',
      status: 'Delivered',
      timestamp: '2026-02-01 03:45 PM',
      completed: true,
    },
  ],
  customer: {
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 234 567 8901',
  },
  deliveryAddress: '123 Main St, New York, NY 10001',
  items: [
    {
      id: '1',
      name: 'Classic Taffy Mix',
      quantity: 2,
      pricePerUnit: 24.99,
      total: 49.98,
    },
    {
      id: '2',
      name: 'Strawberry Delight',
      quantity: 1,
      pricePerUnit: 19.99,
      total: 19.99,
    },
  ],
  subtotal: 69.97,
  shipping: 0,
  total: 69.97,
};
