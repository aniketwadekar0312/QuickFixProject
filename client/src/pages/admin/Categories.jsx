import Layout from "../../components/layout/Layout";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { addCategory, getCategory, updateCategory, deleteCategory } from "../../api/adminServices";
import { Pencil, Image, CircleAlert, Trash2 } from "lucide-react";

const Categories = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ imageUrl: "", name: "" });
  const [categories, setCategories] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const { toast } = useToast();

  // Handle input change
  const onChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await getCategory();
      if (res.status) {
        setCategories(res.categories);
      }
    } catch (error) {
      console.error("Error getting categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setFormData({ imageUrl: category.imageUrl, name: category.name });
  };

  // Handle delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await deleteCategory(id);
      if (res.status) {
        toast({ title: "Category Deleted", description: "The category was removed successfully!" });
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({ title: "Error", description: "Failed to delete the category", variant: "destructive" });
    }
  };

  // Handle form submission (Add/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let res;
      if (editingCategoryId) {
        // Update category
        res = await updateCategory(formData, editingCategoryId);
        if (res.status) {
          toast({ title: "Category Updated", description: "Your category has been updated!" });
        }
      } else {
        // Add new category
        res = await addCategory(formData);
        if (res.status) {
          toast({ title: "Category Added", description: "Your category has been added!" });
        }
      }
      setFormData({ imageUrl: "", name: "" });
      setEditingCategoryId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Categories Table */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
                <CardDescription>Overview of service categories across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.length > 0 ? (
                      categories.map((category, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {category.imageUrl ? (
                              <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            ) : (
                              <Image className="h-10 w-10 text-gray-400" />
                            )}
                          </TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell className="text-center space-x-2">
                            <Button variant="link" size="sm" onClick={() => handleEditCategory(category)}>
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button variant="link" size="sm" onClick={() => handleDeleteCategory(category._id)}>
                              <Trash2 className="h-4 w-4 mr-1 text-red-500" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          <CircleAlert className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <h3 className="text-lg font-semibold mb-2">No Categories Found</h3>
                          <p className="text-gray-600">There are no categories available at this moment.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Add/Edit Category Form */}
            <Card className="lg:col-span-2 max-h-[350px]">
              <CardHeader>
                <CardTitle>{editingCategoryId ? "Edit Category" : "Add Category"}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-3">
                  
                  {/* Image URL Input */}
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="text"
                      value={formData.imageUrl}
                      onChange={onChange}
                      placeholder="Enter category image URL"
                      required
                    />
                    {formData.imageUrl && (
                      <img src={formData.imageUrl} alt="Preview" className="h-16 w-16 rounded-md mt-2 object-cover" />
                    )}
                  </div>

                  {/* Category Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={onChange}
                      placeholder="Enter category name"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : editingCategoryId ? "Update" : "Add"}
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
