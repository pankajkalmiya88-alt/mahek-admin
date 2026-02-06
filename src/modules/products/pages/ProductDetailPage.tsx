import { useCallback, useState } from "react";
import { ArrowLeft, Edit2, EyeOff, Trash2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "zustand";
import { getProductById, deleteProduct } from "@/http/Services/all";
import { confirmationStore } from "@/store/store";
import { ModalType } from "@/shared-component/Confirmation";
import { showSuccess, showError } from "@/utility/utility";

/** API response shape for getProductById */
interface ProductDetailResponse {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPercent?: number;
  stock?: number;
  sizes?: string[];
  isActive?: boolean;
  category?: string;
  images?: string[];
  colors?: string[];
  description?: string;
  averageRating?: number;
  totalReviews?: number;
  reviews?: unknown[];
  createdAt?: string;
  updatedAt?: string;
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const openConfirmation = useStore(
    confirmationStore,
    (s) => s.openConfirmation,
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const {
    data: product,
    isLoading,
    isError,
    error,
  }: any = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await getProductById(id!);
      return (res as { data?: ProductDetailResponse }).data ?? res;
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showSuccess("Product deleted successfully");
      navigate("/products");
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message ?? "Failed to delete product");
    },
  });

  const handleDeleteProduct = useCallback(
    async (productItem: { _id?: string; id?: string }) => {
      const productId = productItem._id ?? productItem.id;
      const response = await openConfirmation({
        title: "Delete Product",
        description: "Are you sure you want to delete this product?",
        type: ModalType.DESTRUCTIVE,
        id: productId,
      });
      if (response?.confirmed && response?.data?.id) {
        deleteMutation.mutate(response.data.id);
      }
    },
    [openConfirmation, deleteMutation],
  );

  const getStockStatus = (stock: number = 0) => {
    if (stock === 0) {
      return {
        text: "Out of Stock",
        color: "text-red-600",
        dotColor: "bg-red-600",
      };
    }
    if (stock < 10) {
      return {
        text: `Low Stock (${stock} units)`,
        color: "text-orange-600",
        dotColor: "bg-orange-600",
      };
    }
    return {
      text: `In Stock (${stock} units)`,
      color: "text-green-600",
      dotColor: "bg-green-600",
    };
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>No product ID provided.</p>
          <Link
            to="/products"
            className="text-purple-600 hover:underline mt-2 inline-block"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-gray-400" />
          <span className="text-gray-600">Loading product...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Failed to load product";
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{message}</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-purple-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p>Product not found.</p>
          <Link
            to="/products"
            className="text-purple-600 hover:underline mt-2 inline-block"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product?.images ?? [];
  const mainImage = images[selectedImageIndex] ?? images[0];
  const stock = product.stock ?? 0;
  const stockStatus = getStockStatus(stock);
  const discountedPrice =
    product.discountPercent != null && product.discountPercent > 0
      ? product.price * (1 - product.discountPercent / 100)
      : null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Products</span>
      </Link>

      <Card className="bg-white p-8">
        <div className="grid grid-cols-2 gap-12">
          {/* Left Side - Product Images */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={`${product.name} - image ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((url: any, index: number) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
                      selectedImageIndex === index
                        ? "border-purple-600 ring-2 ring-purple-200"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <img
                      src={url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Product Details */}
          <div className="flex flex-col">
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h1>
                {product.category && (
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm px-3 py-1">
                    {product.category}
                  </Badge>
                )}
              </div>

              <div className="flex items-baseline gap-3 flex-wrap">
                {discountedPrice != null ? (
                  <>
                    <span className="text-2xl text-gray-500 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-4xl font-bold text-purple-600">
                      ₹{Math.round(discountedPrice).toLocaleString()}
                    </span>
                    <Badge variant="secondary" className="text-sm">
                      {product.discountPercent}% off
                    </Badge>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-purple-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Stock Status
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      stockStatus.dotColor,
                    )}
                  />
                  <span
                    className={cn("text-base font-medium", stockStatus.color)}
                  >
                    {stockStatus.text}
                  </span>
                </div>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Available Sizes
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {product.sizes.map((size: any) => (
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
              )}

              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Colors
                  </h3>
                  <div className="flex gap-2 flex-wrap items-center">
                    {product.colors.map((color: any) => (
                      <span
                        key={color}
                        className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.description && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </h3>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Visibility
                </h3>
                <p
                  className={cn(
                    "text-base font-medium",
                    product.isActive ? "text-green-600" : "text-gray-500",
                  )}
                >
                  {product.isActive
                    ? "Visible to customers"
                    : "Hidden from customers"}
                </p>
              </div>

              {(product.averageRating != null ||
                (product.totalReviews != null && product.totalReviews > 0)) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Reviews
                  </h3>
                  <p className="text-base text-gray-700">
                    {product.averageRating != null && (
                      <span className="font-medium">
                        {product.averageRating.toFixed(1)}
                      </span>
                    )}
                    {product.totalReviews != null &&
                      product.totalReviews > 0 && (
                        <span className="text-gray-500">
                          {" "}
                          ({product.totalReviews} review
                          {product.totalReviews === 1 ? "" : "s"})
                        </span>
                      )}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t mt-8">
              <Button
                className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                asChild
              >
                <Link to={`/products/edit-product/${product._id}`}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button className="h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium">
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </Button>
              <Button
                className="h-12 bg-red-600 hover:bg-red-700 text-white font-medium"
                onClick={() => handleDeleteProduct(product)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetailPage;
