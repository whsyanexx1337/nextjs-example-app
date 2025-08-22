"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  mockMaterials,
  getMaterialsByStatus,
  type Material
} from "@/lib/mockData";

function MMSContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isMaterialDetailsOpen, setIsMaterialDetailsOpen] = useState(false);
  const [isNewMaterialOpen, setIsNewMaterialOpen] = useState(false);
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    location: "",
    supplier: "",
    minThreshold: ""
  });
  const [stockUpdate, setStockUpdate] = useState({
    materialId: "",
    quantity: "",
    operation: "add" // add or subtract
  });

  if (!user) return null;

  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || material.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || material.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(mockMaterials.map(material => material.category)));

  const getStatusColor = (status: Material['status']) => {
    switch (status) {
      case 'In Stock': return 'default';
      case 'Low Stock': return 'secondary';
      case 'Out of Stock': return 'destructive';
      default: return 'outline';
    }
  };

  const getStockLevel = (quantity: number, minThreshold: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= minThreshold) return 'Low Stock';
    return 'In Stock';
  };

  const getStockPercentage = (quantity: number, minThreshold: number) => {
    const maxStock = minThreshold * 3; // Assume max stock is 3x minimum threshold
    return Math.min((quantity / maxStock) * 100, 100);
  };

  const handleMaterialClick = (material: Material) => {
    setSelectedMaterial(material);
    setIsMaterialDetailsOpen(true);
  };

  const handleAddMaterial = () => {
    // In a real app, this would make an API call
    console.log('Adding new material:', newMaterial);
    setIsNewMaterialOpen(false);
    setNewMaterial({
      name: "",
      category: "",
      quantity: "",
      unit: "",
      location: "",
      supplier: "",
      minThreshold: ""
    });
    alert('Material added successfully!');
  };

  const handleUpdateStock = () => {
    // In a real app, this would make an API call
    console.log('Updating stock:', stockUpdate);
    setIsUpdateStockOpen(false);
    setStockUpdate({
      materialId: "",
      quantity: "",
      operation: "add"
    });
    alert('Stock updated successfully!');
  };

  const getMaterialStats = () => {
    return {
      totalMaterials: mockMaterials.length,
      inStock: getMaterialsByStatus('In Stock').length,
      lowStock: getMaterialsByStatus('Low Stock').length,
      outOfStock: getMaterialsByStatus('Out of Stock').length,
      totalValue: mockMaterials.reduce((sum, material) => sum + (material.quantity * 10), 0) // Assuming $10 per unit average
    };
  };

  const stats = getMaterialStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Material Management System</h1>
          <p className="text-gray-600 mt-2">
            Track assets, inventory, and promote smarter resource management
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isUpdateStockOpen} onOpenChange={setIsUpdateStockOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Update Stock</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Stock</DialogTitle>
                <DialogDescription>
                  Add or remove stock for existing materials.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Select value={stockUpdate.materialId} onValueChange={(value) => setStockUpdate({...stockUpdate, materialId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMaterials.map(material => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} (Current: {material.quantity} {material.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="operation">Operation</Label>
                  <Select value={stockUpdate.operation} onValueChange={(value) => setStockUpdate({...stockUpdate, operation: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="add">Add Stock</SelectItem>
                      <SelectItem value="subtract">Remove Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={stockUpdate.quantity}
                    onChange={(e) => setStockUpdate({...stockUpdate, quantity: e.target.value})}
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsUpdateStockOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateStock}>
                  Update Stock
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isNewMaterialOpen} onOpenChange={setIsNewMaterialOpen}>
            <DialogTrigger asChild>
              <Button>Add Material</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Material</DialogTitle>
                <DialogDescription>
                  Enter the details for the new material or asset.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Material Name</Label>
                  <Input
                    id="name"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                    placeholder="Enter material name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newMaterial.category} onValueChange={(value) => setNewMaterial({...newMaterial, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                      <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newMaterial.quantity}
                      onChange={(e) => setNewMaterial({...newMaterial, quantity: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newMaterial.unit}
                      onChange={(e) => setNewMaterial({...newMaterial, unit: e.target.value})}
                      placeholder="pieces, kg, etc."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newMaterial.location}
                    onChange={(e) => setNewMaterial({...newMaterial, location: e.target.value})}
                    placeholder="Storage location"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={newMaterial.supplier}
                    onChange={(e) => setNewMaterial({...newMaterial, supplier: e.target.value})}
                    placeholder="Supplier name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minThreshold">Minimum Threshold</Label>
                  <Input
                    id="minThreshold"
                    type="number"
                    value={newMaterial.minThreshold}
                    onChange={(e) => setNewMaterial({...newMaterial, minThreshold: e.target.value})}
                    placeholder="Minimum stock level"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewMaterialOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMaterial}>
                  Add Material
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by name, category, supplier, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Materials Table */}
          <Card>
            <CardHeader>
              <CardTitle>Material Inventory</CardTitle>
              <CardDescription>
                Complete inventory of all materials and assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell>{material.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{material.quantity} {material.unit}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                material.status === 'Out of Stock' ? 'bg-red-500' :
                                material.status === 'Low Stock' ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${getStockPercentage(material.quantity, material.minThreshold)}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{material.location}</TableCell>
                      <TableCell>{material.supplier}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(material.status)}>
                          {material.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(material.lastUpdated)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleMaterialClick(material)}
                          >
                            View
                          </Button>
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredMaterials.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No materials found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMaterials.filter(material => material.status !== 'In Stock').map((material) => (
              <Card key={material.id} className={`border-l-4 ${
                material.status === 'Out of Stock' ? 'border-l-red-500' : 'border-l-yellow-500'
              }`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{material.name}</CardTitle>
                      <CardDescription>{material.category}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(material.status)}>
                      {material.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Stock:</span>
                      <span className="font-medium">{material.quantity} {material.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Minimum Required:</span>
                      <span>{material.minThreshold} {material.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Location:</span>
                      <span>{material.location}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Supplier:</span>
                      <span>{material.supplier}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">Reorder</Button>
                    <Button size="sm" variant="outline">Contact Supplier</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {mockMaterials.filter(material => material.status !== 'In Stock').length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-green-600 font-medium">All materials are adequately stocked!</p>
                <p className="text-gray-500 mt-2">No stock alerts at this time.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Reports</CardTitle>
                <CardDescription>Generate comprehensive inventory reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">Full Inventory Report</Button>
                <Button className="w-full justify-start" variant="outline">Low Stock Report</Button>
                <Button className="w-full justify-start" variant="outline">Category-wise Report</Button>
                <Button className="w-full justify-start" variant="outline">Supplier Report</Button>
                <Button className="w-full justify-start" variant="outline">Usage Report</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Asset valuation and cost analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">Asset Valuation</Button>
                <Button className="w-full justify-start" variant="outline">Purchase History</Button>
                <Button className="w-full justify-start" variant="outline">Cost Analysis</Button>
                <Button className="w-full justify-start" variant="outline">Budget Planning</Button>
                <Button className="w-full justify-start" variant="outline">ROI Analysis</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Export reports in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Reports can be exported in PDF, Excel, or CSV formats. 
                  Scheduled reports can be automatically generated and emailed to stakeholders.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Material Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMaterials}</div>
                <p className="text-xs text-gray-500">Unique items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">In Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
                <p className="text-xs text-gray-500">Adequately stocked</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
                <p className="text-xs text-gray-500">Need reordering</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
                <p className="text-xs text-gray-500">Urgent reorder</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Materials by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map(category => {
                    const categoryMaterials = mockMaterials.filter(m => m.category === category);
                    const percentage = Math.round((categoryMaterials.length / mockMaterials.length) * 100);
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{categoryMaterials.length}</span>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-8">{percentage}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Status Overview</CardTitle>
                <CardDescription>Current stock health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">In Stock</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(stats.inStock / stats.totalMaterials) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{stats.inStock}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Low Stock</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(stats.lowStock / stats.totalMaterials) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{stats.lowStock}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Out of Stock</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(stats.outOfStock / stats.totalMaterials) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">{stats.outOfStock}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Material Details Dialog */}
      <Dialog open={isMaterialDetailsOpen} onOpenChange={setIsMaterialDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedMaterial?.name}</DialogTitle>
            <DialogDescription>{selectedMaterial?.category}</DialogDescription>
          </DialogHeader>
          {selectedMaterial && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">Category:</Label>
                  <p>{selectedMaterial.category}</p>
                </div>
                <div>
                  <Label className="font-medium">Current Stock:</Label>
                  <p>{selectedMaterial.quantity} {selectedMaterial.unit}</p>
                </div>
                <div>
                  <Label className="font-medium">Minimum Threshold:</Label>
                  <p>{selectedMaterial.minThreshold} {selectedMaterial.unit}</p>
                </div>
                <div>
                  <Label className="font-medium">Location:</Label>
                  <p>{selectedMaterial.location}</p>
                </div>
                <div>
                  <Label className="font-medium">Supplier:</Label>
                  <p>{selectedMaterial.supplier}</p>
                </div>
                <div>
                  <Label className="font-medium">Last Updated:</Label>
                  <p>{formatDate(selectedMaterial.lastUpdated)}</p>
                </div>
                <div className="col-span-2">
                  <Label className="font-medium">Status:</Label>
                  <Badge variant={getStatusColor(selectedMaterial.status)}>
                    {selectedMaterial.status}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="font-medium">Stock Level:</Label>
                <Progress value={getStockPercentage(selectedMaterial.quantity, selectedMaterial.minThreshold)} />
                <p className="text-xs text-gray-500">
                  {selectedMaterial.quantity > selectedMaterial.minThreshold ? 
                    'Stock level is adequate' : 
                    'Stock level is below minimum threshold'
                  }
                </p>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button className="flex-1">Update Stock</Button>
                <Button variant="outline">Edit Material</Button>
                <Button variant="outline" onClick={() => setIsMaterialDetailsOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MMSPage() {
  return (
    <RoleBasedRoute allowedRoles={["Administrator", "Dean", "Teacher"]}>
      <MMSContent />
    </RoleBasedRoute>
  );
}
