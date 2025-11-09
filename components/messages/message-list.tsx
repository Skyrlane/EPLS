import { useState, useEffect } from "react";
import { MessageCard } from "./message-card";
import { MessageFilter } from "./message-filter";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  preacher: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  passage?: string;
}

interface MessageListProps {
  messages: Message[];
  initialLimit?: number;
}

export function MessageList({ messages, initialLimit = 6 }: MessageListProps) {
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [visibleCount, setVisibleCount] = useState(initialLimit);

  // Extraire les catégories uniques
  const categories = [...new Set(messages.map(message => message.category))];
  
  // Extraire les prédicateurs uniques
  const preachers = [...new Set(messages.map(message => message.preacher))];
  
  // Extraire les années uniques
  const years = [...new Set(messages.map(message => {
    const date = new Date(message.date);
    return date.getFullYear().toString();
  }))].sort((a, b) => parseInt(b) - parseInt(a)); // Trier les années de façon décroissante
  
  useEffect(() => {
    setFilteredMessages(messages);
  }, [messages]);
  
  const handleFilter = (filters: { 
    search: string; 
    category: string; 
    preacher: string; 
    year: string;
  }) => {
    let result = [...messages];
    
    // Filtre par recherche de texte
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        message => 
          message.title.toLowerCase().includes(searchLower) || 
          message.description.toLowerCase().includes(searchLower) ||
          (message.passage && message.passage.toLowerCase().includes(searchLower))
      );
    }
    
    // Filtre par catégorie
    if (filters.category) {
      result = result.filter(message => message.category === filters.category);
    }
    
    // Filtre par prédicateur
    if (filters.preacher) {
      result = result.filter(message => message.preacher === filters.preacher);
    }
    
    // Filtre par année
    if (filters.year) {
      result = result.filter(message => {
        const date = new Date(message.date);
        return date.getFullYear().toString() === filters.year;
      });
    }
    
    setFilteredMessages(result);
    setVisibleCount(initialLimit); // Réinitialiser le nombre de messages visibles après filtrage
  };
  
  const loadMore = () => {
    setVisibleCount(prev => prev + initialLimit);
  };
  
  return (
    <div className="space-y-6">
      <MessageFilter 
        categories={categories}
        preachers={preachers}
        years={years}
        onFilter={handleFilter}
      />
      
      {filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">
            Aucun message ne correspond à vos critères de recherche.
          </p>
          <p className="text-gray-500 mt-2">
            Essayez de modifier vos filtres pour voir plus de résultats.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMessages.slice(0, visibleCount).map((message) => (
              <MessageCard 
                key={message.id}
                title={message.title}
                date={message.date}
                category={message.category}
                description={message.description}
                preacher={message.preacher}
              />
            ))}
          </div>
          
          {visibleCount < filteredMessages.length && (
            <div className="flex justify-center mt-10">
              <Button onClick={loadMore} variant="outline" size="lg">
                Voir plus de messages
              </Button>
            </div>
          )}
          
          <div className="text-gray-500 text-sm text-center mt-2">
            Affichage de {Math.min(visibleCount, filteredMessages.length)} sur {filteredMessages.length} messages
          </div>
        </>
      )}
    </div>
  );
} 