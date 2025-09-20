"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";

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

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
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

  useEffect(() => {
    setProducts([
      { id: 1, name: "Laptop", price: 15000000, stock: 10 },
      { id: 2, name: "Mouse", price: 200000, stock: 50 },
      { id: 3, name: "Keyboard", price: 500000, stock: 30 },
      { id: 4, name: "Monitor", price: 2500000, stock: 15 },
    ]);
  }, []);

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

  const handleEdit = (index: number) => {
    setForm(products[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
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
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {" "}
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
      <Card className="p-4">
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Cari produk (case sensitive)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select onValueChange={setFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="harga-tertinggi">Harga Tertinggi</SelectItem>
              <SelectItem value="harga-terendah">Harga Terendah</SelectItem>
              <SelectItem value="stok-terbanyak">Stok Terbanyak</SelectItem>
              <SelectItem value="stok-tersedikit">Stok Tersedikit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {filteredProducts.map((p, index) => (
            <Card key={p.id} className="p-3 flex justify-between items-center">
              <CardContent className="p-0 flex-1">
                <p className="font-bold">{p.name}</p>
                <p>ID: {p.id}</p>
                <p>Harga: Rp{p.price}</p>
                <p>Stok: {p.stock}</p>
              </CardContent>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(index)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(index)}
                >
                  Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}
