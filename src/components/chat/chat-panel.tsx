'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, DollarSign } from 'lucide-react';
import { formatCents, formatRelativeTime, getInitials } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  type: string;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface ChatPanelProps {
  bookingId: string;
  currentUserId: string;
}

export function ChatPanel({ bookingId, currentUserId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchMessages();
    // Poll every 5 seconds
    pollRef.current = setInterval(fetchMessages, 5000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchMessages() {
    try {
      const res = await fetch(`/api/chat?bookingId=${bookingId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch {
      // Silent fail for polling
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          content: newMessage.trim(),
          type: 'TEXT',
        }),
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch {
      // Error handling
    } finally {
      setSending(false);
    }
  }

  async function sendPriceOffer(amount: number) {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          content: `Price offer: ${formatCents(amount)}`,
          type: 'PRICE_OFFER',
          metadata: { offeredPriceCents: amount },
        }),
      });
      fetchMessages();
    } catch {
      // Error handling
    }
  }

  async function acceptOffer(offeredPriceCents: number) {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          content: `Accepted price: ${formatCents(offeredPriceCents)}`,
          type: 'PRICE_ACCEPTED',
          metadata: { offeredPriceCents },
        }),
      });
      fetchMessages();
    } catch {
      // Error handling
    }
  }

  function scrollToBottom() {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  function renderMessage(msg: Message) {
    const isOwn = msg.sender.id === currentUserId;
    const isSystem = msg.type === 'SYSTEM';

    if (isSystem) {
      return (
        <div key={msg.id} className="flex justify-center">
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {msg.content}
          </span>
        </div>
      );
    }

    if (msg.type === 'PRICE_OFFER') {
      const offered = (msg.metadata as any)?.offeredPriceCents;
      return (
        <div key={msg.id} className={cn('flex gap-3', isOwn ? 'justify-end' : 'justify-start')}>
          <div className={cn('max-w-[75%] rounded-lg border p-3', isOwn ? 'bg-primary/5' : 'bg-muted')}>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Price Offer</span>
            </div>
            <p className="text-lg font-bold">{offered ? formatCents(offered) : msg.content}</p>
            {!isOwn && offered && (
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="default" onClick={() => acceptOffer(offered)}>Accept</Button>
                <Button size="sm" variant="outline">Counter</Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(msg.createdAt)}</p>
          </div>
        </div>
      );
    }

    if (msg.type === 'PRICE_ACCEPTED') {
      return (
        <div key={msg.id} className="flex justify-center">
          <Badge variant="success" className="text-sm py-1 px-3">
            Price agreed: {msg.content}
          </Badge>
        </div>
      );
    }

    return (
      <div key={msg.id} className={cn('flex gap-3', isOwn ? 'justify-end' : 'justify-start')}>
        {!isOwn && (
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs">
              {getInitials(msg.sender.firstName, msg.sender.lastName)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className={cn('max-w-[75%]', isOwn ? 'items-end' : 'items-start')}>
          {!isOwn && (
            <p className="text-xs text-muted-foreground mb-1">
              {msg.sender.firstName} {msg.sender.lastName}
            </p>
          )}
          <div
            className={cn(
              'rounded-lg px-3 py-2 text-sm',
              isOwn
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted'
            )}
          >
            {msg.content}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatRelativeTime(msg.createdAt)}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Chat</CardTitle>
      </CardHeader>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No messages yet. Start the conversation.
          </p>
        ) : (
          messages.map(renderMessage)
        )}
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim() || sending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
