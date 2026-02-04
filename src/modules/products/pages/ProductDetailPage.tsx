import { useState } from "react";
import { ArrowLeft, Edit2, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

// Mock product data
const productData = {
  id: 1,
  name: "Classic Taffy Mix",
  category: "All",
  price: 24.99,
  stock: 150,
  images: {
    front: "https://images.unsplash.com/photo-1581798459219-c8f5a92e5d5e?w=600&h=600&fit=crop",
    back: "https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=600&h=600&fit=crop",
    left: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=600&fit=crop",
    right: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=600&h=600&fit=crop",
  },
  availableSizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
  description: "A delicious mix of classic taffy flavors",
  isVisible: true,
};

const ProductDetailPage = () => {
  const [selectedImage, setSelectedImage] = useState<"front" | "back" | "left" | "right">("front");

  const imageViews = [
    { key: "front" as const, label: "Front" },
    { key: "back" as const, label: "Back" },
    { key: "left" as const, label: "Left" },
    { key: "right" as const, label: "Right" },
  ];

  const getStockStatus = () => {
    if (productData.stock === 0) {
      return { text: "Out of Stock", color: "text-red-600", dotColor: "bg-red-600" };
    } else if (productData.stock < 10) {
      return { text: `Low Stock (${productData.stock} units)`, color: "text-orange-600", dotColor: "bg-orange-600" };
    } else {
      return { text: `In Stock (${productData.stock} units)`, color: "text-green-600", dotColor: "bg-green-600" };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {/* Main Content */}
        <Card className="bg-white p-8">
          <div className="grid grid-cols-2 gap-12">
            {/* Left Side - Product Images */}
            <div className="space-y-4">
              {/* Main Image Display */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={productData.images[selectedImage]}
                  alt={`${productData.name} - ${selectedImage} view`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {imageViews.map((view) => (
                  <button
                    key={view.key}
                    onClick={() => setSelectedImage(view.key)}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      selectedImage === view.key
                        ? "border-purple-600 ring-2 ring-purple-200"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <img
                      src={productData.images[view.key]}
                      alt={`${view.label} view`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                      <span className="text-white text-xs font-medium">{view.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="flex flex-col">
              <div className="flex-1 space-y-6">
                {/* Product Name */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {productData.name}
                  </h1>
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm px-3 py-1">
                    {productData.category}
                  </Badge>
                </div>

                {/* Price */}
                <div className="text-4xl font-bold text-purple-600">
                  ${productData.price.toFixed(2)}
                </div>

                {/* Stock Status */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Stock Status
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full", stockStatus.dotColor)}></span>
                    <span className={cn("text-base font-medium", stockStatus.color)}>
                      {stockStatus.text}
                    </span>
                  </div>
                </div>

                {/* Available Sizes */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Available Sizes
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {productData.availableSizes.map((size) => (
                      <Button
                        key={size}
                        variant="outline"
                        className="h-10 px-6 border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {productData.description}
                  </p>
                </div>

                {/* Visibility */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Visibility
                  </h3>
                  <p className={cn("text-base font-medium", productData.isVisible ? "text-green-600" : "text-gray-500")}>
                    {productData.isVisible ? "Visible to customers" : "Hidden from customers"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t mt-8">
                <Button
                  className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  className="h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  Hide
                </Button>
                <Button
                  className="h-12 bg-red-600 hover:bg-red-700 text-white font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
