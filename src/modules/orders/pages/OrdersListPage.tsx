import * as React from "react";
import { Search, Eye, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ordersData, type Order, type OrderStatus } from "@/data/ordersData";
import { Link } from "react-router";

const OrdersListPage = () => {
  const [searchValue, setSearchValue] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");

  // Filter orders based on search and status
  const filteredOrders = React.useMemo(() => {
    return ordersData.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchValue.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchValue, filterStatus]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    return {
      total: ordersData.length,
      pending: ordersData.filter((o) => o.status === "PENDING").length,
      shipped: ordersData.filter((o) => o.status === "SHIPPED").length,
      inTransit: ordersData.filter((o) => o.status === "IN TRANSIT").length,
      delivered: ordersData.filter((o) => o.status === "DELIVERED").length,
    };
  }, []);

  // Get status badge styling
  const getStatusBadgeClass = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "IN TRANSIT":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "SHIPPED":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "CANCELLED":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Track and manage customer orders</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-6">
        {/* Total */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Total</p>
            <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Pending</p>
            <p className="text-4xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </CardContent>
        </Card>

        {/* Shipped */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Shipped</p>
            <p className="text-4xl font-bold text-purple-600">
              {stats.shipped}
            </p>
          </CardContent>
        </Card>

        {/* In Transit */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">In Transit</p>
            <p className="text-4xl font-bold text-blue-600">
              {stats.inTransit}
            </p>
          </CardContent>
        </Card>

        {/* Delivered */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 mb-2">Delivered</p>
            <p className="text-4xl font-bold text-green-600">
              {stats.delivered}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by order ID, customer name, or email..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 h-11 border-gray-300 bg-white"
          />
        </div>

        {/* Filter Dropdown */}
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px] h-11 border-gray-300 bg-white">
            <SelectValue placeholder="All Orders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
            <SelectItem value="IN TRANSIT">In Transit</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="SHIPPED">Shipped</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card className="bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Order ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Items
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-gray-50">
                    {/* Order ID */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {order.orderNumber}
                        </span>
                      </div>
                    </TableCell>

                    {/* Customer */}
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer.email}
                        </div>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-gray-700">
                      {order.date}
                    </TableCell>

                    {/* Items */}
                    <TableCell className="text-gray-700">
                      {order.itemsCount} item(s)
                    </TableCell>

                    {/* Total */}
                    <TableCell className="font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={`${getStatusBadgeClass(order.status)} font-semibold text-xs px-3 py-1`}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Link
                        to="/orders/detail/1"
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-gray-500"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersListPage;
