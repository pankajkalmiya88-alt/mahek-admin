import { useRef, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { z } from "zod";
import { ArrowLeft, Check, X, Eye, Plus } from "lucide-react";
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
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/ui/star-rating";
import { createProduct } from "@/http/Services/all";
import { showError, showSuccess } from "@/utility/utility";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
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

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"] as const;
const ALLOWED_IMAGE_ACCEPT = ".jpg,.jpeg,.png";

function validateImageFile(file: File): { valid: true } | { valid: false; error: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return {
      valid: false,
      error: "Invalid file type. Only JPG, JPEG, and PNG images are allowed.",
    };
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: "File is too large. Maximum size is 5 MB.",
    };
  }
  return { valid: true };
}

const AddEditProductPage = () => {
  const navigate = useNavigate();
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S"]);
  /** Each slot is either a URL (uploaded) or null (empty). Order preserved for images array. */
  const [imageFields, setImageFields] = useState<(string | null)[]>([null]);
  /** Display name (e.g. file name) per slot for UI. Same length as imageFields. */
  const [displayNames, setDisplayNames] = useState<(string | null)[]>([null]);
  /** Indices of slots currently uploading. Enables concurrent uploads and per-field isolation. */
  const [uploadingSlots, setUploadingSlots] = useState<number[]>([]);
  /** Per-slot validation/upload error messages. */
  const [errorBySlot, setErrorBySlot] = useState<Record<number, string>>({});
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
    images: [] as string[],
    description: "",
    isVisible: true,
    isFeatured: false,
    rating: 0,
    discount: 0,
    colors: [] as string[],
  });

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      showSuccess("Product created successfully");
      navigate("/products");
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showError(error?.response?.data?.message ?? "Failed to create product");
    },
  });

  const form = useForm({
    defaultValues: {
      productName: "",
      category: "",
      price: "",
      stockCount: "",
      availableSizes: ["S"],
      images: [] as string[],
      description: "",
      isVisible: true,
      isFeatured: false,
      rating: 0,
      discount: 0,
      colors: [] as string[],
    },
    onSubmit: async ({ value }) => {
      const images = (value.images ?? []).filter(
        (u): u is string => typeof u === "string" && u.length > 0
      );
      const payload = {
        ...value,
        images,
        price: Number(value.price),
        stockCount: Number(value.stockCount),
        rating: Number(value.rating),
        discount: Number(value.discount),
      };
      mutation.mutate(payload);
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

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const syncImagesToForm = (fields: (string | null)[]) => {
    const urls = fields.filter((u): u is string => u != null);
    form.setFieldValue("images", urls);
    setPreviewData((prev) => ({ ...prev, images: urls }));
  };

  const addImageField = () => {
    setImageFields((prev) => [...prev, null]);
    setDisplayNames((prev) => [...prev, null]);
  };

  const removeImageField = (slotIndex: number) => {
    setImageFields((prev) => {
      const next = prev.filter((_, i) => i !== slotIndex);
      const resolved = next.length > 0 ? next : [null];
      syncImagesToForm(resolved);
      return resolved;
    });
    setDisplayNames((prev) => {
      const next = prev.filter((_, i) => i !== slotIndex);
      return next.length > 0 ? next : [null];
    });
    setUploadingSlots((prev) =>
      prev.filter((s) => s !== slotIndex).map((s) => (s > slotIndex ? s - 1 : s))
    );
    setErrorBySlot((prev) => {
      const next: Record<number, string> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = Number(k);
        if (ki === slotIndex) return;
        next[ki > slotIndex ? ki - 1 : ki] = v;
      });
      return next;
    });
  };

  const handleImageUpload = async (file: File, slotIndex: number) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorBySlot((prev) => ({ ...prev, [slotIndex]: validation.error }));
      showError(validation.error);
      if (fileInputRefs.current[slotIndex]) fileInputRefs.current[slotIndex]!.value = "";
      return;
    }

    setUploadingSlots((prev) => (prev.includes(slotIndex) ? prev : [...prev, slotIndex]));
    setErrorBySlot((prev) => {
      const next = { ...prev };
      delete next[slotIndex];
      return next;
    });

    try {
      const data = await uploadImageToCloudinary(file);
      setImageFields((prev) => {
        const next = [...prev];
        next[slotIndex] = data.secure_url;
        syncImagesToForm(next);
        return next;
      });
      setDisplayNames((prev) => {
        const next = [...prev];
        next[slotIndex] = file.name;
        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Image upload failed";
      setErrorBySlot((prev) => ({ ...prev, [slotIndex]: message }));
      showError(message);
    } finally {
      setUploadingSlots((prev) => prev.filter((s) => s !== slotIndex));
      const input = fileInputRefs.current[slotIndex];
      if (input) input.value = "";
    }
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
                  {() => (
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

              {/* Product Images - dynamic fields; each field has its own input and state */}
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel>Product Images</FieldLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5 shrink-0"
                    onClick={addImageField}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Image
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  {imageFields.map((url, slotIndex) => {
                    const isUploading = uploadingSlots.includes(slotIndex);
                    const slotError = errorBySlot[slotIndex];
                    const isError = Boolean(slotError);
                    const isSuccess = url != null && !isError;
                    const displayName =
                      displayNames[slotIndex] ?? (url ? url.split("/").pop() ?? "Image" : null);

                    return (
                      <div key={slotIndex} className="flex flex-col gap-2">
                        <input
                          ref={(el) => {
                            fileInputRefs.current[slotIndex] = el;
                          }}
                          type="file"
                          accept={ALLOWED_IMAGE_ACCEPT}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, slotIndex);
                          }}
                        />
                        <div className="flex gap-2 items-center">
                          <div
                            className={cn(
                              "flex flex-1 min-w-0 gap-0 rounded-md overflow-hidden border shadow-xs h-10",
                              isSuccess && "border-green-600",
                              isError && "border-destructive",
                              !isError && !isSuccess && "border-input"
                            )}
                          >
                            <div
                              className={cn(
                                "flex flex-1 min-w-0 h-10 items-center gap-2 bg-transparent px-3 text-sm text-foreground",
                                isUploading && "bg-muted/30"
                              )}
                            >
                              {isUploading ? (
                                <>
                                  <Spinner className="size-4 shrink-0 text-muted-foreground" />
                                  <span className="text-muted-foreground truncate">Uploading...</span>
                                </>
                              ) : isError ? (
                                <>
                                  <span className="flex-1 min-w-0 truncate text-muted-foreground">Choose file</span>
                                  <span className="flex shrink-0 text-destructive" aria-hidden>
                                    <X className="size-4" />
                                  </span>
                                </>
                              ) : displayName ? (
                                <>
                                  <span className="flex-1 min-w-0 truncate">{displayName}</span>
                                  <span className="flex shrink-0 text-green-600" aria-hidden>
                                    <Check className="size-4" />
                                  </span>
                                </>
                              ) : (
                                <span className="text-muted-foreground truncate">Choose file</span>
                              )}
                            </div>
                            <Button
                              type="button"
                              className="h-10 rounded-none rounded-r-md bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 text-sm font-medium shrink-0 disabled:opacity-50 disabled:pointer-events-none"
                              disabled={isUploading}
                              onClick={() => fileInputRefs.current[slotIndex]?.click()}
                            >
                              Browse...
                            </Button>
                          </div>
                          {imageFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeImageField(slotIndex)}
                              aria-label={`Remove image field ${slotIndex + 1}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        {isSuccess && (
                          <p className="text-sm text-green-600">File is valid</p>
                        )}
                        {isError && slotError && (
                          <p className="text-sm text-red-600" role="alert">
                            {slotError}
                          </p>
                        )}
                        {slotIndex === 0 && imageFields.length === 1 && (
                          <p className="text-sm text-muted-foreground">JPG, JPEG or PNG. Max 5 MB.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
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
                    setImageFields([null]);
                    setDisplayNames([null]);
                    setUploadingSlots([]);
                    setErrorBySlot({});
                    setSelectedColors([]);
                    syncImagesToForm([null]);
                    setCustomColorInput("");
                    setPreviewData({
                      productName: "",
                      category: "",
                      price: "",
                      stockCount: "",
                      availableSizes: ["S"],
                      images: [],
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
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      Adding...
                    </>
                  ) : (
                    "Add Product"
                  )}
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
