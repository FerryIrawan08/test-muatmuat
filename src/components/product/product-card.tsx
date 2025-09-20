import { Product } from "@/types/product";
import { FormatRupiah } from "@arismun/format-rupiah";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Pen, Trash } from "lucide-react";

interface Props {
  product: Product;
}

const ProductCard = ({ name, price, stock }: Product) => {
  const [openDialogEdit, setOpenDialogEdit] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="p-5">
        <div>
          <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            {name}
          </h5>
        </div>
        <p className="text-lg font-semibold">
          <FormatRupiah value={price} />
        </p>
        <div className="flex items-center justify-between">
          <p className="mt-1">Note : Stok {stock}</p>
          <div className="flex items-center">
            <Dialog open={openDialogEdit} onOpenChange={setOpenDialogEdit}>
              <DialogTrigger>
                <Button
                  onClick={() => {
                    setOpenDialogEdit(true);
                  }}
                  variant={"ghost"}
                  size={"icon"}
                >
                  <Pen size={20} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog open={openDialogDelete} onOpenChange={setOpenDialogDelete}>
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
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-3">
                  {" "}
                  <Button
                    onClick={() => {
                      setOpenDialogEdit(false);
                    }}
                    variant={"outline"}
                  >
                    Cancel
                  </Button>
                  <Button variant={"destructive"}>Delete</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
