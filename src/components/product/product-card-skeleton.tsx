import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <Skeleton className="max-w-sm h-32 bg-neutral-300 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700" />
  );
};

export default ProductCardSkeleton;
