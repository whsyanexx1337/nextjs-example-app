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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  mockBooks,
  searchBooks,
  type Book
} from "@/lib/mockData";

function LibraryContent() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailsOpen, setIsBookDetailsOpen] = useState(false);

  if (!user) return null;

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = searchTerm === "" || 
                         book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm) ||
                         book.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(mockBooks.map(book => book.category)));

  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'Available': return 'default';
      case 'Checked Out': return 'destructive';
      case 'Reserved': return 'secondary';
      default: return 'outline';
    }
  };

  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsBookDetailsOpen(true);
  };

  const handleReserveBook = (bookId: string) => {
    // In a real app, this would make an API call
    console.log('Reserving book:', bookId);
    alert('Book reserved successfully!');
  };

  const handleCheckoutBook = (bookId: string) => {
    // In a real app, this would make an API call
    console.log('Checking out book:', bookId);
    alert('Book checked out successfully!');
  };

  const getLibraryStats = () => {
    return {
      totalBooks: mockBooks.length,
      availableBooks: mockBooks.filter(book => book.status === 'Available').length,
      checkedOutBooks: mockBooks.filter(book => book.status === 'Checked Out').length,
      reservedBooks: mockBooks.filter(book => book.status === 'Reserved').length,
      totalCopies: mockBooks.reduce((sum, book) => sum + book.copies, 0)
    };
  };

  const stats = getLibraryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Library System & OPAC</h1>
        <p className="text-gray-600 mt-2">
          Online Public Access Catalog - Search and manage library resources
        </p>
      </div>

      <Tabs defaultValue="catalog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalog">Book Catalog</TabsTrigger>
          <TabsTrigger value="my-books">My Books</TabsTrigger>
          {(user.role === "Administrator" || user.role === "Dean" || user.role === "Teacher") && (
            <TabsTrigger value="management">Library Management</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by title, author, ISBN, or category..."
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
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Checked Out">Checked Out</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                      <CardDescription>by {book.author}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(book.status)}>
                      {book.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Category:</span>
                      <span className="font-medium">{book.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Publisher:</span>
                      <span>{book.publisher}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Year:</span>
                      <span>{book.year}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>ISBN:</span>
                      <span className="font-mono text-xs">{book.isbn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Available:</span>
                      <span className={book.available > 0 ? "text-green-600" : "text-red-600"}>
                        {book.available}/{book.copies}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Location:</span>
                      <span className="text-xs">{book.location}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleBookClick(book)}
                    >
                      View Details
                    </Button>
                    {book.status === 'Available' && book.available > 0 && (
                      <Button 
                        size="sm" 
                        onClick={() => handleCheckoutBook(book.id)}
                      >
                        Checkout
                      </Button>
                    )}
                    {book.status === 'Checked Out' && (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => handleReserveBook(book.id)}
                      >
                        Reserve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No books found matching your search criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-books" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Borrowed Books</CardTitle>
              <CardDescription>Books currently checked out to you</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  This section would show books currently checked out to the logged-in user, 
                  along with due dates and renewal options. In a real system, this would be 
                  populated from the user's borrowing history.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Reservations</CardTitle>
              <CardDescription>Books you have reserved</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  This section would show books that the user has reserved, 
                  along with their position in the queue and estimated availability dates.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Borrowing History</CardTitle>
              <CardDescription>Previously borrowed books</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  This section would show the user's complete borrowing history, 
                  including return dates and any associated fees or fines.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {(user.role === "Administrator" || user.role === "Dean" || user.role === "Teacher") && (
          <TabsContent value="management" className="space-y-4">
            {/* Library Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Books</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalBooks}</div>
                  <p className="text-xs text-gray-500">Unique titles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Copies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCopies}</div>
                  <p className="text-xs text-gray-500">All copies</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.availableBooks}</div>
                  <p className="text-xs text-gray-500">Ready to checkout</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Checked Out</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.checkedOutBooks}</div>
                  <p className="text-xs text-gray-500">Currently borrowed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Reserved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.reservedBooks}</div>
                  <p className="text-xs text-gray-500">On hold</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common library management tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start">Add New Book</Button>
                  <Button className="w-full justify-start" variant="outline">Process Returns</Button>
                  <Button className="w-full justify-start" variant="outline">Generate Reports</Button>
                  <Button className="w-full justify-start" variant="outline">Manage Overdue Books</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest library transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertDescription>
                      This would show recent checkouts, returns, reservations, and other library activities.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Book Details Dialog */}
      <Dialog open={isBookDetailsOpen} onOpenChange={setIsBookDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
            <DialogDescription>by {selectedBook?.author}</DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="font-medium">ISBN:</Label>
                  <p className="font-mono">{selectedBook.isbn}</p>
                </div>
                <div>
                  <Label className="font-medium">Category:</Label>
                  <p>{selectedBook.category}</p>
                </div>
                <div>
                  <Label className="font-medium">Publisher:</Label>
                  <p>{selectedBook.publisher}</p>
                </div>
                <div>
                  <Label className="font-medium">Year:</Label>
                  <p>{selectedBook.year}</p>
                </div>
                <div>
                  <Label className="font-medium">Copies:</Label>
                  <p>{selectedBook.copies}</p>
                </div>
                <div>
                  <Label className="font-medium">Available:</Label>
                  <p className={selectedBook.available > 0 ? "text-green-600" : "text-red-600"}>
                    {selectedBook.available}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="font-medium">Location:</Label>
                  <p>{selectedBook.location}</p>
                </div>
                <div className="col-span-2">
                  <Label className="font-medium">Status:</Label>
                  <Badge variant={getStatusColor(selectedBook.status)}>
                    {selectedBook.status}
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                {selectedBook.status === 'Available' && selectedBook.available > 0 && (
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      handleCheckoutBook(selectedBook.id);
                      setIsBookDetailsOpen(false);
                    }}
                  >
                    Checkout Book
                  </Button>
                )}
                {selectedBook.status === 'Checked Out' && (
                  <Button 
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      handleReserveBook(selectedBook.id);
                      setIsBookDetailsOpen(false);
                    }}
                  >
                    Reserve Book
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsBookDetailsOpen(false)}>
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

export default function LibraryPage() {
  return (
    <RoleBasedRoute allowedRoles={["Administrator", "Dean", "Teacher", "Student"]}>
      <LibraryContent />
    </RoleBasedRoute>
  );
}
