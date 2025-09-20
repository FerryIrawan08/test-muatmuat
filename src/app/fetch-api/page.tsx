"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  game_index: number;
  version: {
    name: string;
    url: string;
  };
}

interface PropsEffect {
  effect: string;
}
export default function FetchApi() {
  const [data, setData] = useState(null);
  const [dataKeyEffect, setDataKeyEffect] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isLoadingKeyEffect, setLoadingKeyEffect] = useState(true);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/ditto")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/ability/battle-armor")
      .then((res) => res.json())
      .then((data) => {
        setDataKeyEffect(data);
        setLoadingKeyEffect(false);
      });
  }, []);

  const filteredResponse: Props[] = data?.game_indices;
  const filteredEffectResponse: PropsEffect[] = dataKeyEffect?.effect_entries;

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;
  if (isLoadingKeyEffect) return <p>Loading...</p>;
  if (!dataKeyEffect) return <p>No profile data</p>;
  return (
    <div className=" custom-container mt-12">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Game Index</TableHead>
            <TableHead>Version Name</TableHead>
            <TableHead>Version URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResponse.map((_, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell>{_.game_index}</TableCell>
              <TableCell>{_.version.name}</TableCell>
              <TableCell>
                <a href={_.version.url} className=" underline text-blue-500">
                  {_.version.url}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-2 mt-5">
        {" "}
        {filteredEffectResponse.map((_, idx) => (
          <span key={idx}>{_.effect}</span>
        ))}
      </div>
    </div>
  );
}
