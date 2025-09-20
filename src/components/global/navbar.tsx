import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="p-4 border-b  w-full bg-black flex items-center justify-between">
      <p className="text-lg font-semibold text-white">Logo</p>
      <div className="flex text-white items-center gap-2.5">
        <Link prefetch href={"/"}>
          Soal Produk
        </Link>
        <Link prefetch href={"/fetch-api"}>
          Soal Fetch API
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
