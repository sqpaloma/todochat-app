"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TeamFilters } from "@/types/team";

interface TeamFiltersProps {
  filters: TeamFilters;
  onFiltersChange: (updates: Partial<TeamFilters>) => void;
  onClearFilters: () => void;
}

export function TeamFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: TeamFiltersProps) {
  const hasActiveFilters = filters.searchTerm;

  return (
    <Card className="border-purple-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search members..."
                value={filters.searchTerm}
                onChange={(e) =>
                  onFiltersChange({ searchTerm: e.target.value })
                }
                className="pl-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                aria-label="Search team members"
              />
            </div>
          </div>

          <div className="flex gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="px-2"
                aria-label="Clear all filters"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
