'use client';

/**
 * Éditeur Markdown avec preview temps réel
 */

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { processMarkdown, countWords } from '@/lib/markdown-processor';
import { calculateReadingTime } from '@/lib/blog-utils';
import { 
  Bold, 
  Italic, 
  Heading, 
  List, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Eye,
  Edit
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function MarkdownEditor({ 
  value, 
  onChange, 
  placeholder = 'Écrivez votre article en Markdown...',
  minHeight = '400px'
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const wordCount = countWords(value);
  const readingTime = calculateReadingTime(value);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);

    // Restaurer la sélection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const toolbarButtons = [
    { 
      icon: Heading, 
      label: 'Titre', 
      action: () => insertMarkdown('## ', ''),
      tooltip: 'Titre'
    },
    { 
      icon: Bold, 
      label: 'Gras', 
      action: () => insertMarkdown('**', '**'),
      tooltip: 'Gras'
    },
    { 
      icon: Italic, 
      label: 'Italique', 
      action: () => insertMarkdown('*', '*'),
      tooltip: 'Italique'
    },
    { 
      icon: List, 
      label: 'Liste', 
      action: () => insertMarkdown('\n- ', ''),
      tooltip: 'Liste à puces'
    },
    { 
      icon: LinkIcon, 
      label: 'Lien', 
      action: () => insertMarkdown('[', '](url)'),
      tooltip: 'Lien'
    },
    { 
      icon: ImageIcon, 
      label: 'Image', 
      action: () => insertMarkdown('![alt](', ')'),
      tooltip: 'Image'
    },
  ];

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-muted/50 border-b p-2 flex items-center gap-1">
        {toolbarButtons.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.label}
              type="button"
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={button.tooltip}
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}

        <div className="flex-1" />

        {/* Stats */}
        <div className="text-xs text-muted-foreground mr-3">
          {wordCount} mots • {readingTime} min de lecture
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'write' | 'preview')}>
        <div className="bg-muted/30 border-b px-2">
          <TabsList className="h-9">
            <TabsTrigger value="write" className="text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Écrire
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">
              <Eye className="h-3 w-3 mr-1" />
              Prévisualiser
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="m-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="border-0 rounded-none resize-none focus-visible:ring-0 font-mono text-sm"
            style={{ minHeight }}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0 p-4" style={{ minHeight }}>
          {value ? (
            <div 
              className="prose prose-slate dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: processMarkdown(value) }}
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              Rien à prévisualiser. Écrivez du contenu en Markdown dans l&apos;onglet &quot;Écrire&quot;.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
