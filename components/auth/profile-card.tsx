import { useState } from "react";
import Image from "next/image";
import { Edit, User, Mail, Phone, Calendar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { User as UserType } from "@/types";

interface ProfileCardProps {
  user: UserType;
  className?: string;
  allowEdit?: boolean;
  onEditProfile?: () => void;
}

export function ProfileCard({ 
  user, 
  className,
  allowEdit = false,
  onEditProfile
}: ProfileCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Générer les initiales pour l'avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleEditClick = () => {
    if (onEditProfile) {
      setIsLoading(true);
      // Simuler un délai pour démontrer le chargement
      setTimeout(() => {
        onEditProfile();
        setIsLoading(false);
      }, 500);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className={cn("w-full max-w-md overflow-hidden", className)}>
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-primary/30 to-primary h-32 relative">
          {allowEdit && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 right-4 z-10"
              onClick={handleEditClick}
              disabled={isLoading}
            >
              {isLoading ? 
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-foreground" /> : 
                <Edit className="h-4 w-4 mr-1" />
              }
              {isLoading ? "" : "Modifier"}
            </Button>
          )}
        </div>
        <div className="flex justify-center -mt-16 relative z-10 px-6">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center mt-4 px-6">
          <h2 className="text-xl font-bold">{user.displayName}</h2>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex justify-center gap-2 mt-2">
            <Badge variant="outline" className="capitalize">
              {user.role}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className="space-y-4">
          {user.memberInfo?.role && (
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Fonction</p>
                <p className="text-sm text-muted-foreground">{user.memberInfo.role}</p>
              </div>
            </div>
          )}
          
          {user.memberInfo?.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Téléphone</p>
                <p className="text-sm text-muted-foreground">{user.memberInfo.phone}</p>
              </div>
            </div>
          )}
          
          {user.createdAt && (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Membre depuis</p>
                <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      {user.memberInfo?.ministry && user.memberInfo.ministry.length > 0 && (
        <CardFooter className="border-t px-6 py-4">
          <div className="w-full">
            <h3 className="text-sm font-medium mb-2">Ministères</h3>
            <div className="flex flex-wrap gap-2">
              {user.memberInfo.ministry.map((ministry: string, index: number) => (
                <Badge key={index} variant="secondary" className="capitalize">
                  {ministry}
                </Badge>
              ))}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 