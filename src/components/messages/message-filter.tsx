import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export interface FilterOption {
  value: string;
  label: string;
}

export interface MessageFilterProps {
  themeOptions: FilterOption[];
  preacherOptions: FilterOption[];
  dateOptions: FilterOption[];
  onFilterChange: (filters: MessageFilters) => void;
}

export interface MessageFilters {
  theme: string;
  preacher: string;
  date: string;
  sortBy: 'newest' | 'oldest' | 'popular';
}

export function MessageFilter({
  themeOptions,
  preacherOptions,
  dateOptions,
  onFilterChange,
}: MessageFilterProps) {
  const [filters, setFilters] = useState<MessageFilters>({
    theme: 'all',
    preacher: 'all',
    date: 'all',
    sortBy: 'newest',
  });

  const handleFilterChange = (key: keyof MessageFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <div className="space-y-2">
        <Label htmlFor="theme-select">Thème</Label>
        <Select
          value={filters.theme}
          onValueChange={(value) => handleFilterChange('theme', value)}
        >
          <SelectTrigger id="theme-select" aria-label="Thème">
            <SelectValue placeholder="Sélectionner un thème" />
          </SelectTrigger>
          <SelectContent>
            {themeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preacher-select">Prédicateur</Label>
        <Select
          value={filters.preacher}
          onValueChange={(value) => handleFilterChange('preacher', value)}
        >
          <SelectTrigger id="preacher-select" aria-label="Prédicateur">
            <SelectValue placeholder="Sélectionner un prédicateur" />
          </SelectTrigger>
          <SelectContent>
            {preacherOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date-select">Période</Label>
        <Select
          value={filters.date}
          onValueChange={(value) => handleFilterChange('date', value)}
        >
          <SelectTrigger id="date-select" aria-label="Période">
            <SelectValue placeholder="Sélectionner une période" />
          </SelectTrigger>
          <SelectContent>
            {dateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sort-select">Trier par</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => handleFilterChange('sortBy', value as 'newest' | 'oldest' | 'popular')}
        >
          <SelectTrigger id="sort-select" aria-label="Trier par">
            <SelectValue placeholder="Sélectionner un tri" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="oldest">Plus anciens</SelectItem>
            <SelectItem value="popular">Popularité</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 