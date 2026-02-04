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
import ProductPreview from "./addTimePreview";

const availableSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

const AddEditProductPage = () => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S"]);
  const [imageInputs, setImageInputs] = useState<string[]>([""]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  
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
    },
    onSubmit: async ({ value }) => {
      console.log("Form Values:", value);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
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
                              <SelectItem value="All">All</SelectItem>
                              <SelectItem value="Men">Men</SelectItem>
                              <SelectItem value="Women">Women</SelectItem>
                              <SelectItem value="Kids">Kids</SelectItem>
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
                        <div className="flex gap-2">
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
                    setPreviewData({
                      productName: "",
                      category: "",
                      price: "",
                      stockCount: "",
                      availableSizes: ["S"],
                      images: [""],
                      description: "",
                      isVisible: true,
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEditProductPage;
