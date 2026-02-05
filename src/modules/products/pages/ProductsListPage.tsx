import * as React from "react";
import { Search, Filter, Plus, Eye, Edit2, Trash2, EyeOff, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductsList } from "@/http/Services/all";

const ProductListPage = () => {
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = React.useState("");
  const [showSearchSpinner, setShowSearchSpinner] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [limit] = React.useState(20);

  // Debounce search input
  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const trimmedValue = searchValue.trim();
      setDebouncedSearchValue(trimmedValue);
      setShowSearchSpinner(false);
    }, 500);

    if (searchValue.trim().length > 0) {
      setShowSearchSpinner(true);
    }

    return () => window.clearTimeout(timeoutId);
  }, [searchValue]);

  // Reset to first page when search changes
  React.useEffect(() => {
    setOffset(0);
  }, [debouncedSearchValue]);

  // Build query string for API
  const queryString = React.useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearchValue) {
      params.append("search", debouncedSearchValue);
    }
    params.append("offset", offset.toString());
    params.append("limit", limit.toString());
    return `?${params.toString()}`;
  }, [debouncedSearchValue, offset, limit]);

  // Fetch products using TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", queryString],
    queryFn: () => getProductsList(queryString),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  console.log('data: ', data);
  const products = data?.data?.products || [];
  const totalCount = data?.data?.total || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your product inventory
          </p>
        </div>
        <Link to={"/products/add-product"}>
          <Button className="bg-[#8B1A1A] hover:bg-[#6f1414]">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search products..."
            className="pl-10 pr-10 h-10 border-gray-300"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {showSearchSpinner && (
            <LoaderCircle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="w-4 h-4 text-gray-600" />
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[120px] h-10">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="kids">Kids</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <LoaderCircle className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading products...</span>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-red-600 font-semibold">Error loading products</p>
            <p className="text-sm text-gray-500 mt-1">
              {error?.message || "Something went wrong"}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-600 font-semibold">No products found</p>
            <p className="text-sm text-gray-500 mt-1">
              {debouncedSearchValue
                ? "Try adjusting your search"
                : "Add some products to get started"}
            </p>
          </div>
        </div>
      )}

      {/* Products Grid - 5 columns */}
      {!isLoading && !isError && products.length > 0 && (
        <>
          <div className="grid grid-cols-5 gap-4">
            {products.map((product: any) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image with Badges */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product?.images && product?.images?.length && product?.images[0]  || "https://via.placeholder.com/400"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Badges Overlay */}
                  {product.stock === 0 && (
                    <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1">
                      SOLD OUT
                    </Badge>
                  )}
                  {product.stock > 0 && product.stock < 10 && (
                    <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1">
                      Low Stock
                    </Badge>
                  )}
                </div>

                {/* Product Details */}
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {product.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-purple-600">
                      ₹{product.price}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock < 10
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      Stock: {product.stock}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Link to={`/products/detail/${product.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-4 text-xs font-medium border-gray-300 hover:bg-gray-50"
                      >
                        View
                      </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon-sm"
                        className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon-sm"
                        className="h-8 w-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Section */}
          {totalCount > limit && (
            <div className="mt-6 flex items-center justify-between border-t pt-6">
              <div className="text-sm text-gray-600">
                Showing {offset + 1} to {Math.min(offset + limit, totalCount)} of {totalCount} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
                  disabled={offset === 0}
                >
                  Previous
                </Button>
                <div className="text-sm text-gray-600">
                  Page {Math.floor(offset / limit) + 1} of {Math.ceil(totalCount / limit)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOffset((prev) => prev + limit)}
                  disabled={offset + limit >= totalCount}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListPage;
