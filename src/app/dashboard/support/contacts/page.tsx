"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Mail, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ContactMessage } from "@/types";

const mockContacts: ContactMessage[] = [
  { id: "1", user: "u1", userName: "John Student", subject: "Question about enrollment", body: "How do I enroll in multiple courses?", email: "john@uni.edu", created_at: "2025-06-01T10:00:00Z" },
  { id: "2", user: "u2", userName: "Sarah Lecturer", subject: "Material upload issue", body: "Cannot upload PDF files larger than 10MB", email: "sarah@uni.edu", created_at: "2025-06-02T14:00:00Z" },
  { id: "3", user: "u3", userName: "Mike User", subject: "Feature request", body: "Would be great to have a dark mode for the mobile app", email: "mike@uni.edu", created_at: "2025-05-28T09:00:00Z" },
];

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const filtered = mockContacts.filter((c) =>
        c.subject.toLowerCase().includes(search.toLowerCase()) ||
        (c.userName?.toLowerCase().includes(search.toLowerCase()) ?? false)
      );
      setContacts(filtered);
      setLoading(false);
    }, 300);
  }, [search]);

  return (
    <div className="max-w-[1500px] mx-auto px-8 py-8 flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-muted-foreground mt-1">View user contact messages.</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages ({contacts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact, i) => (
                <motion.div key={contact.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{contact.subject}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Mail className="h-3 w-3" />
                        <span>{contact.email}</span>
                        <span>•</span>
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(contact.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{contact.body}</p>
                  <div className="flex justify-end mt-3">
                    <Button size="sm" variant="outline">Reply</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}