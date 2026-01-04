"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronRightIcon, AlertCircleIcon, BellIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface Notice {
  id: string;
  title: string;
  date?: string;
  time?: string;
  description?: string;
  link?: string;
  isHighPriority?: boolean;
}

interface ImportantNoticesProps {
  notices: Notice[];
  className?: string;
}

export function ImportantNotices({ notices, className }: ImportantNoticesProps) {
  if (!notices || notices.length === 0) {
    return null;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className={cn("w-full rounded-lg bg-muted/30 backdrop-blur-sm p-6", className)}>
      <div className="flex items-center gap-2 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <BellIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Annonces importantes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Restez informé des actualités et événements clés de notre église
          </p>
        </div>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {notices.map((notice, index) => (
          <NoticeCard 
            key={notice.id} 
            notice={notice} 
            index={index}
          />
        ))}
      </motion.div>
      
      <div className="mt-8 flex items-center justify-center">
        <Button variant="outline" asChild className="group">
          <Link href="/culte/calendrier" className="flex items-center">
            <span>Voir tous les événements</span>
            <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

interface NoticeCardProps {
  notice: Notice;
  index: number;
}

function NoticeCard({ notice, index }: NoticeCardProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      variants={item}
      layout
    >
      <Card className={cn(
        "overflow-hidden transition-all hover:shadow-md",
        notice.isHighPriority
          ? "border-l-4 border-l-primary bg-primary/5"
          : ""
      )}>
        <CardContent className="p-5 relative">
          <div className="space-y-3">
            {notice.isHighPriority && (
              <div className="flex items-center gap-1.5 text-primary text-sm font-medium mb-1">
                <AlertCircleIcon className="h-4 w-4" />
                <span>Annonce importante</span>
              </div>
            )}
            
            <div className="space-y-1">
              <h3 className={cn(
                "font-semibold leading-tight", 
                notice.isHighPriority ? "text-primary" : ""
              )}>
                {notice.title}
              </h3>
              
              {(notice.date || notice.time) && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-4 w-4 flex-shrink-0" />
                  <span>
                    {notice.date}{notice.date && notice.time ? " — " : ""}{notice.time}
                  </span>
                </div>
              )}
            </div>
            
            {notice.description && (
              <p className="text-sm text-muted-foreground">
                {notice.description}
              </p>
            )}
            
            {notice.link && (
              <div className="pt-1">
                <Button variant="link" asChild className="px-0 h-auto font-normal text-primary">
                  <Link href={notice.link} className="flex items-center">
                    <span>En savoir plus</span>
                    <ChevronRightIcon className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 