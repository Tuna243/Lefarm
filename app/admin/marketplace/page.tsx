"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, Pencil, Trash2, Store, Tag, Users } from "lucide-react"

interface Category {
  id: string
  name: string
  icon?: string
  productCount: number
}

interface Supplier {
  id: string
  name: string
  email: string
  location: string
  products: number
  status: string
  joinDate: string
}

export default function MarketplacePage() {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchSuppliers()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products')
      const products = await response.json()
      
      // Group products by category and count them
      const categoryMap: Record<string, number> = {}
      products.forEach((product: any) => {
        const cat = product.category || 'Khác'
        categoryMap[cat] = (categoryMap[cat] || 0) + 1
      })

      // Convert to category list
      const categoryEmojis: Record<string, string> = {
        'chili': '🌶️',
        'lemongrass': '🌾',
        'ginger': '🥘',
        'fruit': '🍎',
      }

      const categoryList = Object.entries(categoryMap).map(([name, count]) => ({
        id: name,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        icon: categoryEmojis[name] || '📦',
        productCount: count,
      }))

      setCategories(categoryList)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSuppliers = async () => {
    // For now, return empty - you can add supplier API later
    setSuppliers([])
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Marketplace Management</h1>
        <p className="text-muted-foreground">Manage categories, suppliers, and marketplace settings</p>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="categories" className="gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="gap-2">
            <Users className="h-4 w-4" />
            Suppliers
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Store className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Product Categories</h2>
            <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>Create a new product category for the marketplace.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="cat-name">Category Name</Label>
                    <Input id="cat-name" placeholder="Enter category name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-desc">Description</Label>
                    <Input id="cat-desc" placeholder="Brief description" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddCategoryOpen(false)}>Add Category</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                      {category.icon}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive-foreground">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{category.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{category.productCount} sản phẩm</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Registered Suppliers</h2>
            <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>Register a new supplier for the marketplace.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="sup-name">Supplier Name</Label>
                    <Input id="sup-name" placeholder="Enter supplier name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sup-email">Email</Label>
                    <Input id="sup-email" type="email" placeholder="contact@supplier.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sup-location">Location</Label>
                    <Input id="sup-location" placeholder="City, State" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddSupplierOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddSupplierOpen(false)}>Add Supplier</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Chưa có nhà cung cấp nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    suppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>{supplier.products}</TableCell>
                        <TableCell>{supplier.joinDate}</TableCell>
                        <TableCell>
                          <Badge
                            variant={supplier.status === "approved" ? "default" : "secondary"}
                            className={supplier.status === "approved" ? "bg-primary/10 text-primary" : ""}
                          >
                            {supplier.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {supplier.status === "pending" && (
                              <Button size="sm" variant="outline">
                                Approve
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Settings</CardTitle>
              <CardDescription>Configure global marketplace settings and features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Enable Public Marketplace</p>
                  <p className="text-sm text-muted-foreground">Allow visitors to browse products without login</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Auto-approve Suppliers</p>
                  <p className="text-sm text-muted-foreground">Automatically approve new supplier registrations</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Product Reviews</p>
                  <p className="text-sm text-muted-foreground">Enable customer reviews on products</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Low Stock Alerts</p>
                  <p className="text-sm text-muted-foreground">Send notifications when stock is below threshold</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
                <Input id="low-stock-threshold" type="number" defaultValue={50} className="w-32" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
