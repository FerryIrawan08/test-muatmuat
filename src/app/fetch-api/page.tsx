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

interface Pokemon {
  is_hidden: boolean;
  pokemon: {
    name: string;
    url: string;
  };
}

export default function FetchApi() {
  const [data, setData] = useState<{ game_indices: Props[] } | null>(null);
  const [dataKeyEffect, setDataKeyEffect] = useState<{
    effect_entries: PropsEffect[];
    pokemon: Pokemon[];
  } | null>(null);

  const [isLoading, setLoading] = useState(true);
  const [isLoadingKeyEffect, setLoadingKeyEffect] = useState(true);

  // fetch pokemon data
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/ditto")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // fetch ability data
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/ability/battle-armor")
      .then((res) => res.json())
      .then((data) => {
        setDataKeyEffect(data);
        setLoadingKeyEffect(false);
      })
      .catch(() => setLoadingKeyEffect(false));
  }, []);

  const filteredResponse: Props[] = data?.game_indices ?? [];
  const filteredEffectResponse: PropsEffect[] =
    dataKeyEffect?.effect_entries ?? [];
  const filteredPokemon: Pokemon[] = dataKeyEffect?.pokemon ?? [];

  const filteredIsHidden = filteredPokemon.filter((num) => num.is_hidden);

  if (isLoading || isLoadingKeyEffect) return <p>Loading...</p>;
  if (!data || !dataKeyEffect) return <p>No profile data</p>;

  return (
    <div className="custom-container mt-12">
      {/* Table Game Indices */}
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
          {filteredResponse.map((item, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell>{item.game_index}</TableCell>
              <TableCell>{item.version.name}</TableCell>
              <TableCell>
                <a href={item.version.url} className="underline text-blue-500">
                  {item.version.url}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Effect Entries */}
      <div className="flex flex-col gap-2 mt-5">
        {filteredEffectResponse.map((effect, idx) => (
          <span key={idx}>{effect.effect}</span>
        ))}
      </div>

      {/* Pokemon Hidden Ability */}
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Pokemon Name</TableHead>
            <TableHead>URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIsHidden.map((poke, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium">{idx + 1}</TableCell>
              <TableCell>{poke.pokemon.name}</TableCell>
              <TableCell>
                <a href={poke.pokemon.url} className="underline text-blue-500">
                  {poke.pokemon.url}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
