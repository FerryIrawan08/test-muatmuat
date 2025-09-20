import { Product } from "@/types/product";
import { FormatRupiah } from "@arismun/format-rupiah";
import React from "react";

const ProductCard = ({ name, price, stock }: Product) => {
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
        <p className="mt-1">Note : Stok {stock}</p>
      </div>
    </div>
  );
};

export default ProductCard;
