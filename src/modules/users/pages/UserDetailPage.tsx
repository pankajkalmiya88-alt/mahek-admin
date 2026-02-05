import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { userDetailData } from "@/data/userDetailData";

const UserDetailPage = () => {
  const user = userDetailData;

  // Get initials from name
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    return parts.map((part) => part[0]).join("");
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "blocked":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  // Get order status badge styling
  const getOrderStatusBadgeClass = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "CANCELLED":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "PROCESSING":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Users</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar - User Info */}
        <div className="lg:col-span-1">
          <Card className="bg-white">
            <CardContent className="p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {getInitials(user.name)}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user.name}
                </h2>
                <Badge className={`${getStatusBadgeClass(user.status)} font-medium`}>
                  {user.status}
                </Badge>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 mb-6">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{user.email}</span>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{user.phone}</span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{user.address}</span>
                </div>

                {/* Join Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    Joined {user.joinDate}
                  </span>
                </div>

                {/* Total Orders */}
                <div className="flex items-start gap-3">
                  <ShoppingBag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">
                    {user.totalOrders} total orders
                  </span>
                </div>
              </div>

              {/* Block User Button */}
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-11">
                <UserX className="w-5 h-5 mr-2" />
                Block User
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            {/* Total Orders */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-2">Total Orders</p>
                <p className="text-4xl font-bold text-gray-900">
                  {user.totalOrders}
                </p>
              </CardContent>
            </Card>

            {/* Total Spent */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <p className="text-sm text-gray-600 mb-2">Total Spent</p>
                <p className="text-4xl font-bold text-purple-600">
                  ${user.totalSpent.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order History
              </h3>

              <div className="space-y-4">
                {user.orders.map((order) => (
                  <Card key={order.id} className="border border-gray-200">
                    <CardContent className="p-5">
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900">
                            {order.orderNumber}
                          </h4>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <Badge
                          className={`${getOrderStatusBadgeClass(order.status)} font-semibold text-xs px-3 py-1`}
                        >
                          {order.status}
                        </Badge>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-700">
                              {item.name} x {item.quantity}
                            </span>
                            <span className="font-semibold text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Total */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="font-semibold text-gray-900">
                          Total
                        </span>
                        <span className="font-bold text-lg text-purple-600">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h3>

              <div className="space-y-6">
                {user.recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4">
                    {/* Timeline Dot */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-600 flex-shrink-0" />
                      {index < user.recentActivity.length - 1 && (
                        <div className="w-0.5 h-full bg-purple-200 mt-2" />
                      )}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 pb-6">
                      <p className="text-gray-900 font-medium">
                        {activity.action} {activity.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
