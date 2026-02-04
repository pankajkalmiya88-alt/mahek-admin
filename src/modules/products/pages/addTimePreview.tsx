import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import StarRating from "@/components/ui/star-rating";

interface ProductPreviewProps {
  productName: string;
  category: string;
  price: string;
  stockCount: string;
  availableSizes: string[];
  images: string[];
  description: string;
  isVisible: boolean;
  rating: number;
  discount: number;
  colors: string[];
}

const ProductPreview = ({
  productName,
  category,
  price,
  stockCount,
  availableSizes,
  images,
  description,
  isVisible,
  rating,
  discount,
  colors,
}: ProductPreviewProps) => {
  const stockNumber = Number(stockCount) || 0;
  const priceNumber = Number(price) || 0;
  const discountedPrice = priceNumber - (priceNumber * discount) / 100;
  const hasDiscount = discount > 0;

  // Determine stock status
  const getStockStatus = () => {
    if (stockNumber === 0) {
      return { text: "Out of Stock", color: "text-red-600", dotColor: "bg-red-600" };
    } else if (stockNumber < 10) {
      return { text: `Low Stock (${stockNumber} units)`, color: "text-orange-600", dotColor: "bg-orange-600" };
    } else {
      return { text: `In Stock (${stockNumber} units)`, color: "text-green-600", dotColor: "bg-green-600" };
    }
  };

  const stockStatus = getStockStatus();

  // Get the first image or show a placeholder
  const displayImage = images.length > 0 && images[0] 
    ? images[0] 
    : "https://images.unsplash.com/photo-1581798459219-c8f5a92e5d5e?w=400&h=300&fit=crop";

  return (
    <Card className="bg-white p-6 sticky top-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Live Preview
        </h3>
      </div>

      <div className="flex gap-6">
        {/* Product Image */}
        <div className="w-[200px] h-[200px] flex-shrink-0">
          <img
            src={displayImage}
            alt={productName || "Product preview"}
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1581798459219-c8f5a92e5d5e?w=400&h=300&fit=crop";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-4">
          {/* Product Name */}
          <h2 className="text-2xl font-bold text-gray-900">
            {productName || "Product Name"}
          </h2>

          {/* Category Badge */}
          {category && (
            <div>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs px-3 py-1">
                {category}
              </Badge>
            </div>
          )}

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={rating} readonly size="md" />
              <span className="text-sm text-gray-600">({rating}/5)</span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-1">
            {hasDiscount ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-purple-600">
                    ₹{discountedPrice.toFixed(2)}
                  </span>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-1">
                    {discount}% OFF
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-400 line-through">
                    ₹{priceNumber.toFixed(2)}
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Save ₹{(priceNumber - discountedPrice).toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-3xl font-bold text-purple-600">
                ₹{priceNumber.toFixed(2)}
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Stock Status
            </h3>
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", stockStatus.dotColor)}></span>
              <span className={cn("text-sm font-medium", stockStatus.color)}>
                {stockStatus.text}
              </span>
            </div>
          </div>

          {/* Available Sizes */}
          {availableSizes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Available Sizes
              </h3>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    size="sm"
                    className="h-8 px-4 border-gray-300 text-gray-700 cursor-default hover:bg-white"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Available Colors */}
          {colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Available Colors
              </h3>
              <div className="flex gap-2 flex-wrap items-center">
                {colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300 shadow-sm"
                      style={{ backgroundColor: color.startsWith("#") ? color : color }}
                      title={color}
                    />
                    {color.startsWith("#") ? (
                      <span className="text-xs text-gray-500">{color}</span>
                    ) : (
                      <span className="text-xs text-gray-700 capitalize">{color}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-sm text-blue-600">
                {description}
              </p>
            </div>
          )}

          {/* Visibility */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Visibility
            </h3>
            <p className={cn("text-sm font-medium", isVisible ? "text-green-600" : "text-gray-500")}>
              {isVisible ? "Visible to customers" : "Hidden from customers"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductPreview;
