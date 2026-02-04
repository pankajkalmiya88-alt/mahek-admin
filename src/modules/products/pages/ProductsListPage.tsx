import { Search, Filter, Plus, Eye, Edit2, Trash2, EyeOff } from "lucide-react";
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

// Mock product data
const products = [
  { id: 1, name: "Purple Traditional Saree", category: "Saree", price: 1999, stock: 15, image: "https://aditri.co.in/wp-content/uploads/2024/06/182A6280.jpg", badges: [] },
  { id: 2, name: "Red Bridal Lehenga", category: "Lehenga", price: 2499, stock: 10, image: "https://assets.panashindia.com/media/catalog/product/cache/1/image/4333sr08-5688.jpg", badges: ["Premium"] },
  { id: 3, name: "Blue Anarkali Suit", category: "Suit", price: 1499, stock: 20, image: "https://images.jdmagicbox.com/quickquotes/images_main/seasons-classic-saree-14-04-2023-797-272412731-emyncsez.jpg", badges: [] },

  { id: 4, name: "Green Silk Saree", category: "Saree", price: 1899, stock: 18, image: "https://www.kollybollyethnics.com/image/cache/catalog/data/green-silk-saree-800x1100.jpg", badges: [] },
  { id: 5, name: "Golden Bridal Lehenga", category: "Lehenga", price: 2799, stock: 7, image: "https://www.cbazaar.com/images/golden-bridal-lehenga.jpg", badges: ["Low Stock"] },
  { id: 6, name: "Pink Party Suit", category: "Suit", price: 1399, stock: 25, image: "https://rukminim2.flixcart.com/image/850/1000/xif0q/salwar-kurta-dupatta/pink-party-suit.jpg", badges: [] },

  { id: 7, name: "Banarasi Wedding Saree", category: "Saree", price: 2299, stock: 12, image: "https://www.utsavfashion.com/images/product/banarasi-wedding-saree.jpg", badges: [] },
  { id: 8, name: "Maroon Designer Lehenga", category: "Lehenga", price: 2599, stock: 9, image: "https://www.kalkifashion.com/images/maroon-designer-lehenga.jpg", badges: ["Premium"] },
  { id: 9, name: "Yellow Cotton Suit", category: "Suit", price: 1199, stock: 30, image: "https://www.biba.in/on/demandware.static/yellow-cotton-suit.jpg", badges: [] },

  { id: 10, name: "Black Silk Saree", category: "Saree", price: 1799, stock: 14, image: "https://www.samyakk.com/blog/wp-content/uploads/black-silk-saree.jpg", badges: [] },
  { id: 11, name: "Royal Blue Lehenga", category: "Lehenga", price: 2499, stock: 6, image: "https://www.azafashions.com/images/royal-blue-lehenga.jpg", badges: ["Low Stock"] },
  { id: 12, name: "White Anarkali Suit", category: "Suit", price: 1599, stock: 21, image: "https://www.houseofindya.com/images/white-anarkali.jpg", badges: [] },

  { id: 13, name: "Pink Floral Saree", category: "Saree", price: 1699, stock: 17, image: "https://www.mirraw.com/images/pink-floral-saree.jpg", badges: [] },
  { id: 14, name: "Heavy Embroidery Lehenga", category: "Lehenga", price: 2899, stock: 5, image: "https://www.andaazfashion.com/images/heavy-embroidery-lehenga.jpg", badges: ["Premium"] },
  { id: 15, name: "Teal Printed Suit", category: "Suit", price: 1299, stock: 28, image: "https://www.libas.in/images/teal-printed-suit.jpg", badges: [] },

  { id: 16, name: "Red & Gold Saree", category: "Saree", price: 1999, stock: 13, image: "https://www.pothys.com/images/red-gold-saree.jpg", badges: [] },
  { id: 17, name: "Pastel Wedding Lehenga", category: "Lehenga", price: 2699, stock: 8, image: "https://www.wedabout.com/images/pastel-lehenga.jpg", badges: [] },
  { id: 18, name: "Orange Festive Suit", category: "Suit", price: 1399, stock: 26, image: "https://www.sutram.com/images/orange-festive-suit.jpg", badges: [] },

  { id: 19, name: "Classic Cotton Saree", category: "Saree", price: 1499, stock: 22, image: "https://www.taneira.com/images/classic-cotton-saree.jpg", badges: [] },
  { id: 20, name: "Bridal Red Lehenga", category: "Lehenga", price: 2999, stock: 4, image: "https://www.kalkifashion.com/images/bridal-red-lehenga.jpg", badges: ["Low Stock"] },
  { id: 21, name: "Designer Dupatta Suit", category: "Suit", price: 1599, stock: 19, image: "https://www.fabindia.com/images/designer-dupatta-suit.jpg", badges: [] },

  { id: 22, name: "Green Kanjivaram Saree", category: "Saree", price: 2399, stock: 11, image: "https://www.nalli.com/images/green-kanjivaram-saree.jpg", badges: [] },
  { id: 23, name: "Magenta Bridal Lehenga", category: "Lehenga", price: 2799, stock: 7, image: "https://www.azafashions.com/images/magenta-bridal-lehenga.jpg", badges: ["Premium"] },
  { id: 24, name: "Beige Office Suit", category: "Suit", price: 1199, stock: 24, image: "https://www.biba.in/on/demandware.static/beige-office-suit.jpg", badges: [] },

  { id: 25, name: "Festival Special Saree", category: "Saree", price: 1899, stock: 16, image: "https://www.craftsvilla.com/images/festival-special-saree.jpg", badges: [] },
  { id: 26, name: "Green Party Lehenga", category: "Lehenga", price: 2599, stock: 9, image: "https://www.cbazaar.com/images/green-party-lehenga.jpg", badges: [] },
  { id: 27, name: "Blue Printed Suit", category: "Suit", price: 1299, stock: 27, image: "https://www.libas.in/images/blue-printed-suit.jpg", badges: [] },

  { id: 28, name: "Traditional Silk Saree", category: "Saree", price: 2099, stock: 14, image: "https://www.samyakk.com/blog/wp-content/uploads/silk-saree.jpg", badges: [] },
  { id: 29, name: "Wedding Designer Lehenga", category: "Lehenga", price: 2899, stock: 6, image: "https://www.kollybollyethnics.com/image/cache/catalog/data/wedding-designer-lehenga.jpg", badges: ["Low Stock"] },
  { id: 30, name: "Stylish Cotton Suit", category: "Suit", price: 1099, stock: 30, image: "https://www.houseofindya.com/images/stylish-cotton-suit.jpg", badges: [] }
]






const ProductListPage = () => {
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
        <Link to={'/products/add-product'}>
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
            className="pl-10 h-10 border-gray-300"
          />
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

      {/* Products Grid - 5 columns */}
      <div className="grid grid-cols-5 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Product Image with Badges */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Badges Overlay */}
              {product.badges.map((badge, index) => (
                <Badge
                  key={index}
                  className={`absolute top-2 right-2 ${
                    badge === "SOLD OUT"
                      ? "bg-red-600 hover:bg-red-700"
                      : badge === "Low Stock"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-gray-800 hover:bg-gray-900"
                  } text-white text-xs px-2 py-1`}
                >
                  {badge}
                </Badge>
              ))}
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
                <span className="text-xs text-gray-500">View</span>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  {product.badges.includes("Hidden") ? (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      <EyeOff className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductListPage;
