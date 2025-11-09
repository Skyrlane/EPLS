"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Member } from "@/types";

interface MemberListProps {
  members: Member[];
  title?: string;
  description?: string;
  className?: string;
}

export function MemberList({ 
  members, 
  title = "Annuaire des membres", 
  description,
  className 
}: MemberListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simuler un temps de chargement pour une meilleure UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Filtrer les membres avec useMemo pour optimiser les performances
  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return members;
    
    const normalizedSearchTerm = searchTerm.toLowerCase();
    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(normalizedSearchTerm) ||
        member.role.toLowerCase().includes(normalizedSearchTerm) ||
        (member.email && member.email.toLowerCase().includes(normalizedSearchTerm)) ||
        (member.phone && member.phone.includes(normalizedSearchTerm))
    );
  }, [members, searchTerm]);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="mt-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="searchMembers"
            placeholder="Rechercher par nom, fonction, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {filteredMembers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Fonction</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Téléphone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.phone || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Aucun membre ne correspond à votre recherche.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 