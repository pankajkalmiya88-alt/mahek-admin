import { ArrowLeft, Mail, Phone, MapPin, Package, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderDetailData } from "@/data/orderDetailData";

const OrderDetailPage = () => {
  const order = orderDetailData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Orders</span>
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order {order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed on {order.placedDate}
            </p>
          </div>

          {/* Status Dropdown */}
          <Select defaultValue={order.status}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Tracking & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Tracking */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Tracking
              </h2>

              <div className="space-y-0">
                {order.tracking.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    {/* Timeline Icon & Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.completed
                            ? "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      >
                        <Check
                          className={`w-5 h-5 ${
                            step.completed ? "text-white" : "text-gray-400"
                          }`}
                        />
                      </div>
                      {index < order.tracking.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-200 my-1" />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pb-8">
                      <h3
                        className={`font-semibold ${
                          step.completed ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        {step.status}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {step.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                Order Items
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <Card key={item.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ${item.total.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.pricePerUnit.toFixed(2)} each
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer Info, Address, Invoice */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Customer Information
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="font-medium text-gray-900">
                    {order.customer.name}
                  </p>
                </div>

                {/* Email */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <a
                    href={`mailto:${order.customer.email}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    {order.customer.email}
                  </a>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <div className="flex items-center gap-2 text-gray-700 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {order.customer.phone}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card className="bg-white">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Delivery Address
              </h3>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  {order.deliveryAddress}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Invoice */}
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-1">Invoice</h3>
              <p className="text-sm text-purple-100 mb-6">
                Order #{order.orderNumber}
              </p>

              <div className="space-y-3">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-100">Subtotal</span>
                  <span className="font-semibold">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-100">Shipping</span>
                  <span className="font-semibold">
                    {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-3 border-t border-purple-400">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
