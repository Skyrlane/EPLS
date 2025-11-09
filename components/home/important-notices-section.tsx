"use client"

import React from 'react';
import { ImportantNotices, Notice } from "@/components/home/important-notices";

interface ImportantNoticesSectionProps {
  notices: Notice[];
}

export default function ImportantNoticesSection({ notices }: ImportantNoticesSectionProps) {
  return (
    <div className="relative z-10 mb-16">
      <div className="container mx-auto px-4">
        <ImportantNotices notices={notices} className="shadow-md" />
      </div>
    </div>
  );
} 