import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { ArrowLeft, Plus, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/ui/star-rating";
import ProductPreview from "./addTimePreview";

const availableSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
const availableColors = [
  { name: "Red", value: "#EF4444" },
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Gray", value: "#6B7280" },
  { name: "Orange", value: "#F97316" },
];

const AddEditProductPage = () => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S"]);
  const [imageInputs, setImageInputs] = useState<string[]>([""]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customColorInput, setCustomColorInput] = useState("");
  
  // State for live preview
  const [previewData, setPreviewData] = useState({
    productName: "",
    category: "",
    price: "",
    stockCount: "",
    availableSizes: ["S"],
    images: [""],
    description: "",
    isVisible: true,
    isFeatured: false,
    rating: 0,
    discount: 0,
    colors: [] as string[],
  });

  const form = useForm({
    defaultValues: {
      productName: "",
      category: "",
      price: "",
      stockCount: "",
      availableSizes: ["S"],
      images: [""],
      description: "",
      isVisible: true,
      isFeatured: false,
      rating: 0,
      discount: 0,
      colors: [] as string[],
    },
    onSubmit: async ({ value }) => {
      // Convert string values to numbers for API payload
      const payload = {
        ...value,
        price: Number(value.price),
        stockCount: Number(value.stockCount),
        rating: Number(value.rating),
        discount: Number(value.discount),
      };
      console.log("Form Payload:", payload);
    },
  });

  const toggleSize = (size: string) => {
    const newSizes = selectedSizes.includes(size)
      ? selectedSizes.filter((s) => s !== size)
      : [...selectedSizes, size];
    setSelectedSizes(newSizes);
    form.setFieldValue("availableSizes", newSizes);
    setPreviewData({ ...previewData, availableSizes: newSizes });
  };

  const addImageInput = () => {
    const newImages = [...imageInputs, ""];
    setImageInputs(newImages);
    form.setFieldValue("images", newImages);
    setPreviewData({ ...previewData, images: newImages });
  };

  const removeImageInput = (index: number) => {
    if (imageInputs.length > 1) {
      const newImages = imageInputs.filter((_, i) => i !== index);
      setImageInputs(newImages);
      form.setFieldValue("images", newImages);
      setPreviewData({ ...previewData, images: newImages });
    }
  };

  const updateImageInput = (index: number, value: string) => {
    const newImages = [...imageInputs];
    newImages[index] = value;
    setImageInputs(newImages);
    form.setFieldValue("images", newImages);
    setPreviewData({ ...previewData, images: newImages });
  };

  const addColor = (color: string) => {
    if (!selectedColors.includes(color)) {
      const newColors = [...selectedColors, color];
      setSelectedColors(newColors);
      form.setFieldValue("colors", newColors);
      setPreviewData({ ...previewData, colors: newColors });
    }
  };

  const removeColor = (color: string) => {
    const newColors = selectedColors.filter((c) => c !== color);
    setSelectedColors(newColors);
    form.setFieldValue("colors", newColors);
    setPreviewData({ ...previewData, colors: newColors });
  };

  const addCustomColor = () => {
    const color = customColorInput.trim();
    if (color && !selectedColors.includes(color)) {
      const newColors = [...selectedColors, color];
      setSelectedColors(newColors);
      form.setFieldValue("colors", newColors);
      setPreviewData({ ...previewData, colors: newColors });
      setCustomColorInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Products</span>
      </button>

        {/* Dynamic Layout */}
        <div className={cn("grid gap-6", isPreviewVisible ? "grid-cols-2" : "grid-cols-1")}>
          {/* Left Side - Form */}
          <Card className={cn("bg-white p-8", !isPreviewVisible && "max-w-3xl mx-auto w-full")}>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Add New Product
            </h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              {/* Product Name */}
              <div className="space-y-2">
                <form.Field
                  name="productName"
                  validators={{
                    onChange: z
                      .string()
                      .min(1, "Product name is required")
                      .trim(),
                  }}
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="productName">
                          Product Name <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          id="productName"
                          placeholder="e.g., Classic Taffy Mix"
                          value={field.state.value}
                          onChange={(e) => {
                            field.handleChange(e.target.value);
                            setPreviewData({ ...previewData, productName: e.target.value });
                          }}
                          onBlur={field.handleBlur}
                          aria-invalid={isInvalid}
                          className="h-10"
                        />
                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors.map((err) =>
                              typeof err === "string" ? { message: err } : err
                            )}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              {/* Category and Price Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-2">
                  <form.Field
                    name="category"
                    validators={{
                      onChange: z
                        .string()
                        .min(1, "Category is required")
                        .trim(),
                    }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="category">
                            Category <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Select
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value);
                              setPreviewData({ ...previewData, category: value });
                            }}
                          >
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="banarasi sarees">Banarasi Sarees</SelectItem>
                              <SelectItem value="sarees">Sarees</SelectItem>
                              <SelectItem value="lehenga">Lehenga</SelectItem>
                              <SelectItem value="rajputi poshak">Rajputi Poshak</SelectItem>
                              <SelectItem value="bridal lehenga">Bridal Lehenga</SelectItem>
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError
                              errors={field.state.meta.errors.map((err) =>
                                typeof err === "string"
                                  ? { message: err }
                                  : err
                              )}
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <form.Field
                    name="price"
                    validators={{
                      onChange: z
                        .string()
                        .min(1, "Price is required")
                        .refine(
                          (val) => !isNaN(Number(val)) && Number(val) > 0,
                          "Price must be a valid number greater than 0"
                        ),
                    }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="price">
                            Price (₹) <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="price"
                            type="text"
                            placeholder="24.99"
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              setPreviewData({ ...previewData, price: e.target.value });
                            }}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                            className="h-10"
                          />
                          {isInvalid && (
                            <FieldError
                              errors={field.state.meta.errors.map((err) =>
                                typeof err === "string"
                                  ? { message: err }
                                  : err
                              )}
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>
              </div>

              {/* Stock Count and Discount Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Stock Count */}
                <div className="space-y-2">
                  <form.Field
                    name="stockCount"
                    validators={{
                      onChange: z
                        .string()
                        .min(1, "Stock count is required")
                        .refine(
                          (val) =>
                            !isNaN(Number(val)) && Number(val) >= 0,
                          "Stock count must be a valid number"
                        ),
                    }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="stockCount">
                            Stock Count <span className="text-red-500">*</span>
                          </FieldLabel>
                          <Input
                            id="stockCount"
                            type="text"
                            placeholder="100"
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value);
                              setPreviewData({ ...previewData, stockCount: e.target.value });
                            }}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                            className="h-10"
                          />
                          {isInvalid && (
                            <FieldError
                              errors={field.state.meta.errors.map((err) =>
                                typeof err === "string" ? { message: err } : err
                              )}
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>

                {/* Discount */}
                <div className="space-y-2">
                  <form.Field
                    name="discount"
                    validators={{
                      onChange: z
                        .number()
                        .min(0, "Discount cannot be negative")
                        .max(100, "Discount cannot exceed 100%"),
                    }}
                  >
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="discount">
                            Discount (%)
                          </FieldLabel>
                          <Input
                            id="discount"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={field.state.value}
                            onChange={(e) => {
                              const value = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                              field.handleChange(value);
                              setPreviewData({ ...previewData, discount: value });
                            }}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                            className="h-10"
                          />
                          {isInvalid && (
                            <FieldError
                              errors={field.state.meta.errors.map((err) =>
                                typeof err === "string" ? { message: err } : err
                              )}
                            />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <form.Field
                  name="rating"
                  validators={{
                    onChange: z
                      .number()
                      .min(0, "Rating must be at least 0")
                      .max(5, "Rating cannot exceed 5"),
                  }}
                >
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="rating">
                        Product Rating
                      </FieldLabel>
                      <div className="flex items-center gap-3">
                        <StarRating
                          rating={field.state.value}
                          onRatingChange={(rating) => {
                            field.handleChange(rating);
                            setPreviewData({ ...previewData, rating });
                          }}
                        />
                        <span className="text-sm text-gray-600">
                          {field.state.value > 0 
                            ? `${field.state.value} out of 5 stars` 
                            : "No rating"}
                        </span>
                      </div>
                    </Field>
                  )}
                </form.Field>
              </div>

              {/* Available Sizes */}
              <div className="space-y-2">
                <form.Field
                  name="availableSizes"
                  validators={{
                    onChange: z
                      .array(z.string())
                      .min(1, "At least one size must be selected"),
                  }}
                >
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel>
                          Available Sizes <span className="text-red-500">*</span>
                        </FieldLabel>
                        <div className="flex gap-2 flex-wrap">
                          {availableSizes.map((size) => (
                            <Button
                              key={size}
                              type="button"
                              variant="outline"
                              className={cn(
                                "h-10 px-6 border-2 transition-colors",
                                selectedSizes.includes(size)
                                  ? "bg-[#8B1A1A] text-white border-[#8B1A1A] hover:bg-[#8B1A1A]"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                              )}
                              onClick={() => toggleSize(size)}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                        {isInvalid && (
                          <FieldError
                            errors={field.state.meta.errors.map((err) =>
                              typeof err === "string" ? { message: err } : err
                            )}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              {/* Product Colors */}
              <div className="space-y-3">
                <form.Field name="colors">
                  {(field) => (
                    <Field>
                      <FieldLabel>
                        Product Colors
                      </FieldLabel>
                      
                      {/* Color Palette */}
                      <div className="flex gap-2 flex-wrap mb-3">
                        {availableColors.map((color) => (
                          <button
                            key={color.value}
                            type="button"
                            onClick={() => addColor(color.value)}
                            className={cn(
                              "w-10 h-10 rounded-full border-2 transition-all hover:scale-110",
                              selectedColors.includes(color.value)
                                ? "border-purple-600 ring-2 ring-purple-300"
                                : "border-gray-300 hover:border-gray-400",
                              color.value === "#FFFFFF" && "border-gray-400"
                            )}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>

                      {/* Custom Color Input */}
                      <div className="flex gap-2 mb-3">
                        <Input
                          type="text"
                          placeholder="Enter color name or hex code (e.g., #FF5733)"
                          value={customColorInput}
                          onChange={(e) => setCustomColorInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomColor();
                            }
                          }}
                          className="h-10 flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addCustomColor}
                          className="h-10 px-4"
                        >
                          Add
                        </Button>
                      </div>

                      {/* Selected Colors */}
                      {selectedColors.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Selected Colors:</p>
                          <div className="flex gap-2 flex-wrap">
                            {selectedColors.map((color) => (
                              <Badge
                                key={color}
                                variant="outline"
                                className="pl-2 pr-1 py-1 flex items-center gap-2"
                              >
                                <span
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: color.startsWith("#") ? color : color }}
                                />
                                <span className="text-xs">{color}</span>
                                <button
                                  type="button"
                                  onClick={() => removeColor(color)}
                                  className="hover:bg-gray-200 rounded-full p-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </Field>
                  )}
                </form.Field>
              </div>

              {/* Image URLs - Multiple */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FieldLabel>Product Images</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={addImageInput}
                  >
                    <Plus className="w-3 h-3" />
                    Add Image
                  </Button>
                </div>
                <div className="space-y-2">
                  {imageInputs.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="text"
                        placeholder={`Image URL ${index + 1}`}
                        value={image}
                        onChange={(e) => updateImageInput(index, e.target.value)}
                        className="h-10 flex-1"
                      />
                      {imageInputs.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeImageInput(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Image Preview Thumbnails */}
                {imageInputs.some((img) => img.trim()) && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Image Previews:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {imageInputs
                        .filter((img) => img.trim())
                        .map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50"
                          >
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/150?text=Invalid+URL";
                              }}
                            />
                            <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <form.Field name="description">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor="description">
                        Description
                      </FieldLabel>
                      <Textarea
                        id="description"
                        placeholder="Enter product description..."
                        rows={4}
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setPreviewData({ ...previewData, description: e.target.value });
                        }}
                        onBlur={field.handleBlur}
                        className="resize-none"
                      />
                    </Field>
                  )}
                </form.Field>
              </div>

              {/* Product Visible Checkbox */}
              <div className="space-y-2">
                <form.Field name="isVisible">
                  {(field) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="isVisible"
                        checked={field.state.value}
                        onCheckedChange={(checked) => {
                          field.handleChange(checked === true);
                          setPreviewData({ ...previewData, isVisible: checked === true });
                        }}
                      />
                      <FieldLabel
                        htmlFor="isVisible"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Product visible to customers
                      </FieldLabel>
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Featured Product Checkbox */}
              <div className="space-y-2">
                <form.Field name="isFeatured">
                  {(field) => (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="isFeatured"
                        checked={field.state.value}
                        onCheckedChange={(checked) => {
                          field.handleChange(checked === true);
                          setPreviewData({ ...previewData, isFeatured: checked === true });
                        }}
                      />
                      <FieldLabel
                        htmlFor="isFeatured"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Mark as featured product
                      </FieldLabel>
                    </div>
                  )}
                </form.Field>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11 border-gray-300 hover:bg-gray-50"
                  onClick={() => {
                    form.reset();
                    setSelectedSizes(["S"]);
                    setImageInputs([""]);
                    setSelectedColors([]);
                    setCustomColorInput("");
                    setPreviewData({
                      productName: "",
                      category: "",
                      price: "",
                      stockCount: "",
                      availableSizes: ["S"],
                      images: [""],
                      description: "",
                      isVisible: true,
                      isFeatured: false,
                      rating: 0,
                      discount: 0,
                      colors: [],
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11 border-blue-500 text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {isPreviewVisible ? "Hide Preview" : "View"}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add Product
                </Button>
              </div>
            </FieldGroup>
          </form>
          </Card>

          {/* Right Side - Live Preview (conditionally rendered) */}
          {isPreviewVisible && (
            <ProductPreview
              productName={previewData.productName}
              category={previewData.category}
              price={previewData.price}
              stockCount={previewData.stockCount}
              availableSizes={previewData.availableSizes}
              images={previewData.images}
              description={previewData.description}
              isVisible={previewData.isVisible}
              rating={previewData.rating}
              discount={previewData.discount}
              colors={previewData.colors}
            />
          )}
        </div>
    </div>
  );
};

export default AddEditProductPage;
