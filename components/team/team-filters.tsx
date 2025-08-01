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
  uniqueRoles: string[];
  onFiltersChange: (updates: Partial<TeamFilters>) => void;
  onClearFilters: () => void;
}

export function TeamFilters({
  filters,
  uniqueRoles,
  onFiltersChange,
  onClearFilters,
}: TeamFiltersProps) {
  const hasActiveFilters =
    filters.searchTerm ||
    filters.statusFilter !== "all" ||
    filters.roleFilter !== "all";

  return (
    <Card>
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
                className="pl-10"
                aria-label="Search team members"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select
              value={filters.statusFilter}
              onValueChange={(value) =>
                onFiltersChange({ statusFilter: value })
              }
            >
              <SelectTrigger className="w-32" aria-label="Filter by status">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.roleFilter}
              onValueChange={(value) => onFiltersChange({ roleFilter: value })}
            >
              <SelectTrigger className="w-32" aria-label="Filter by role">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {uniqueRoles.map((role: string) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
