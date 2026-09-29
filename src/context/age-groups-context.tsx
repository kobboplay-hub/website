"use client";

import { createContext, useContext } from "react";
import type { AgeGroup } from "@/lib/shopify/types";

const AgeGroupsContext = createContext<AgeGroup[]>([]);

export function AgeGroupsProvider({
  ageGroups,
  children,
}: {
  ageGroups: AgeGroup[];
  children: React.ReactNode;
}) {
  return (
    <AgeGroupsContext.Provider value={ageGroups}>
      {children}
    </AgeGroupsContext.Provider>
  );
}

export function useAgeGroups(): AgeGroup[] {
  return useContext(AgeGroupsContext);
}
