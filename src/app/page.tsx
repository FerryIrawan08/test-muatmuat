"use client";

import ProductCardSkeleton from "@/components/product/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormatRupiah } from "@arismun/format-rupiah";
import { Pen, Search, Trash } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { product } from "@/dummy/product";
import { Card } from "@/components/ui/card";

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nama produk wajib diisi"),
  price: z
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .positive("Harga harus lebih besar dari 0"),
  stock: z
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .nonnegative("Stok tidak boleh negatif"),
});

export type Product = z.infer<typeof productSchema>;

export default function Home() {
  const [loading, isLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>(product);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [form, setForm] = useState<Omit<Product, "id"> & { id: number | null }>(
    {
      id: null,
      name: "",
      price: "" as unknown as number,
      stock: "" as unknown as number,
    }
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("");

  useMemo(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleAddOrUpdate = () => {
    try {
      const parsed = productSchema.parse({
        id: form.id ?? Date.now(),
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
      });

      const nameExists = products.some(
        (p, idx) =>
          idx !== editingIndex &&
          p.name.trim().toLowerCase() === parsed.name.toLowerCase()
      );

      if (nameExists) {
        alert("Nama produk sudah ada!");
        return;
      }

      if (editingIndex !== null) {
        const updated = [...products];
        updated[editingIndex] = parsed;
        setProducts(updated);
        setEditingIndex(null);
      } else {
        setProducts([...products, parsed]);
      }

      setForm({
        id: null,
        name: "",
        price: "" as unknown as number,
        stock: "" as unknown as number,
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        alert(err.errors[0].message as string);
      }
    }
  };
  useEffect(() => {
    isLoading(true);
    setTimeout(() => {
      isLoading(false);
    }, 1000);
  }, []);
  const handleEdit = (index: number) => {
    setForm(products[index]);
    setEditingIndex(index);
  };
  const deleteAll = () => {
    setProducts([]);
  };

  const deleteProduct = (id: number) => {
    const updatedList = products.filter((item) => item.id !== id);
    setProducts(updatedList);
    setOpenDialogDelete(false);
    toast("Product has been deleted.");
  };
  const filteredProducts = useMemo(() => {
    let result = products;

    // search case-sensitive
    if (debouncedSearch) {
      result = result.filter((p) => p.name.includes(debouncedSearch));
    }

    // filter
    if (filter === "harga-tertinggi") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (filter === "harga-terendah") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (filter === "stok-terbanyak") {
      result = [...result].sort((a, b) => b.stock - a.stock);
    } else if (filter === "stok-tersedikit") {
      result = [...result].sort((a, b) => a.stock - b.stock);
    }

    return result;
  }, [products, debouncedSearch, filter]);

  return (
    <section className=" custom-container mt-12">
      <div className="flex flex-col gap-4">
        <div className="flex md:items-center md:flex-row flex-col gap-2  md:justify-between">
          <div className="flex md:items-center md:flex-row flex-col gap-2">
            <p className="md:text-xl font-semibold">List Produk</p>
            <div className="relative">
              <Search size={18} className="  absolute left-2 top-2" />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                type="text"
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harga-tertinggi">High Price</SelectItem>
                <SelectItem value="harga-terendah">Low Price</SelectItem>
                <SelectItem value="stok-terbanyak">High Stock</SelectItem>
                <SelectItem value="stok-tersedikit">Low Stock</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={deleteAll} variant={"destructive"}>
              <Trash />
              <span className=" hidden md:inline-block">Delete All</span>
            </Button>
          </div>
        </div>
        <Card className="p-4">
          {" "}
          <h2 className="text-xl font-bold mb-4">Tambah / Edit Produk</h2>{" "}
          <div className="grid grid-cols-3 gap-2 mb-2">
            {" "}
            <Input
              placeholder="Nama"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />{" "}
            <Input
              placeholder="Harga"
              type="number"
              value={form.price as unknown as string}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value as unknown as number })
              }
            />{" "}
            <Input
              placeholder="Stok"
              type="number"
              value={form.stock as unknown as string}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value as unknown as number })
              }
            />{" "}
          </div>{" "}
          <Button onClick={handleAddOrUpdate}>
            {" "}
            {editingIndex !== null ? "Update Produk" : "Tambah Produk"}{" "}
          </Button>{" "}
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredProducts.length > 0 ? (
            loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : (
              filteredProducts.map((product, index) => (
                <div
                  key={index}
                  className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="p-5">
                    <div>
                      <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                        {product.name}
                      </h5>
                    </div>
                    <p className="text-lg font-semibold">
                      <FormatRupiah value={product.price} />
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="mt-1">Note : Stok {product.stock}</p>
                      <div className="flex items-center">
                        <Button
                          onClick={() => handleEdit(index)}
                          variant={"ghost"}
                          size={"icon"}
                        >
                          <Pen size={20} />
                        </Button>

                        <Dialog
                          open={openDialogDelete}
                          onOpenChange={setOpenDialogDelete}
                        >
                          <DialogTrigger>
                            <Button
                              onClick={() => {
                                setOpenDialogDelete(true);
                              }}
                              variant={"ghost"}
                              size={"icon"}
                            >
                              <Trash size={20} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-3">
                              {" "}
                              <Button
                                onClick={() => {
                                  setOpenDialogDelete(false);
                                }}
                                variant={"outline"}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() =>
                                  deleteProduct(product.id as number)
                                }
                                variant={"destructive"}
                              >
                                Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            <div className=" w-full border rounded-xl border-red-400 p-10 col-span-4 flex justify-center text-lg bg-red-50">
              Maaf, Produk Tidak ada
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
