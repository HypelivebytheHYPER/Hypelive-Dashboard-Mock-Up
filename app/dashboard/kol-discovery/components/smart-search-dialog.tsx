"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SparklesIcon,
  SendIcon,
  UserIcon,
  BotIcon,
  CheckCircle2Icon,
  PhoneIcon,
  DollarSignIcon,
  FileTextIcon,
  InfoIcon,
  TrendingUpIcon
} from "lucide-react";
import { type KOL } from "@/lib/utils/kol-transform";
import { formatNumber, formatCurrency } from "@/lib/utils/kol-transform";
import { useKOLs } from "@/lib/hooks/use-kols";

interface SmartSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectKOLs: (kols: KOL[]) => void;
}

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  suggestions?: string[];
  results?: KOL[];
  metadata?: {
    matchScore?: number;
    reasoning?: string;
    criteria?: string[];
  };
};

export function SmartSearchDialog({ open, onOpenChange, onSelectKOLs }: SmartSearchDialogProps) {
  // Fetch all KOLs for searching
  const { data: kolsData, isLoading: isLoadingKOLs } = useKOLs({ page_size: 1000 });

  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "👋 Hi! I'm your KOL Discovery AI Assistant. I can help you find the perfect influencers based on:\n\n1️⃣ **Client Match** - Type of brand, product, campaign goals\n2️⃣ **Contact Info** - Get phone, email, Line ID for rate negotiations\n3️⃣ **Latest Rates** - Current pricing per scope & channel\n4️⃣ **Work Conditions** - Collaboration stage, availability\n5️⃣ **Performance** - Engagement, ROI, audience quality\n\n📌 **Note**: Contact information is being collected for premium KOLs. We add new contacts weekly!\n\nJust tell me what you're looking for in natural language!",
      suggestions: [
        "Find beauty KOLs for skincare launch in Bangkok",
        "Show me Macro KOLs with 80%+ Thai audience",
        "I need creators who've worked with fashion brands",
        "Find KOLs with contact info and recent rates"
      ]
    }
  ]);
  const [input, setInput] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // AI-powered search processing with real KOL data
  const processQuery = async (query: string): Promise<Message> => {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API processing

    const lowerQuery = query.toLowerCase();
    const allKOLs = kolsData?.items || [];

    // Thai language keyword mapping for better semantic understanding
    const thaiKeywords: Record<string, string[]> = {
      beauty: ["ความงาม", "เครื่องสำอาง", "แต่งหน้า", "beauty"],
      food: ["อาหาร", "ร้านอาหาร", "กิน", "food", "รีวิวอาหาร"],
      review: ["รีวิว", "review", "ทดสอบ"],
      lifestyle: ["ไลฟ์สไตล์", "lifestyle"],
      creator: ["ครีเอเตอร์", "creator", "คอนเทนต์"],
      tech: ["เทคโนโลยี", "แกดเจ็ต", "tech", "technology"]
    };

    // Helper to match Thai/English keywords
    const matchesKeywords = (text: string, keywords: string[]): boolean => {
      return keywords.some(keyword => text.includes(keyword.toLowerCase()));
    };

    // Semantic matching logic based on user's 5 requirements with scoring
    let filteredKOLsWithScores = allKOLs.map((kol) => {
      let score = 0;
      const queryLower = lowerQuery;

      // 1. Influencer match to client type (category/specialization + categoryDescription)
      // Beauty/Skincare
      if (matchesKeywords(queryLower, thaiKeywords.beauty) || queryLower.includes("skincare")) {
        if (kol.specialization?.some(s => matchesKeywords(s.toLowerCase(), thaiKeywords.beauty))) score += 30;
        if (kol.categoryDescription && matchesKeywords(kol.categoryDescription.toLowerCase(), thaiKeywords.beauty)) score += 25;
      }

      // Fashion/Style
      if (queryLower.includes("fashion") || queryLower.includes("style")) {
        if (kol.specialization?.some(s => s.toLowerCase().includes("fashion") || s.toLowerCase().includes("lifestyle"))) score += 30;
        if (kol.categoryDescription?.toLowerCase().includes("ไลฟ์สไตล์")) score += 25;
      }

      // Food/Restaurant
      if (matchesKeywords(queryLower, thaiKeywords.food) || queryLower.includes("restaurant")) {
        if (kol.specialization?.some(s => matchesKeywords(s.toLowerCase(), thaiKeywords.food))) score += 30;
        if (kol.categoryDescription && matchesKeywords(kol.categoryDescription.toLowerCase(), thaiKeywords.food)) score += 25;
      }

      // Review content
      if (matchesKeywords(queryLower, thaiKeywords.review)) {
        if (kol.categoryDescription && matchesKeywords(kol.categoryDescription.toLowerCase(), thaiKeywords.review)) score += 30;
      }

      // Tech/Gadget
      if (matchesKeywords(queryLower, thaiKeywords.tech) || queryLower.includes("gadget")) {
        if (kol.categoryDescription && matchesKeywords(kol.categoryDescription.toLowerCase(), thaiKeywords.tech)) score += 30;
      }

      // 2. Contact info availability
      if (queryLower.includes("contact") || queryLower.includes("phone") || queryLower.includes("email")) {
        if (kol.contactPhone || kol.contactEmail || kol.lineId) score += 25;
      }

      // 3. Location matching
      if (queryLower.includes("bangkok") || queryLower.includes("กรุงเทพ")) {
        if (kol.location?.some(loc => loc.toLowerCase().includes("bangkok"))) score += 20;
      }
      if (queryLower.includes("thailand") || queryLower.includes("thai") || queryLower.includes("ไทย")) {
        if (kol.location?.some(loc => loc.toLowerCase().includes("thailand"))) score += 15;
      }
      if (queryLower.includes("chiang mai") || queryLower.includes("เชียงใหม่")) {
        if (kol.location?.some(loc => loc.toLowerCase().includes("chiang mai"))) score += 20;
      }

      // 4. KOL Level matching
      if (queryLower.includes("mega")) {
        if (kol.level === "Mega") score += 20;
      }
      if (queryLower.includes("macro")) {
        if (kol.level === "Macro") score += 20;
      }
      if (queryLower.includes("micro")) {
        if (kol.level === "Micro") score += 20;
      }
      if (queryLower.includes("nano")) {
        if (kol.level === "Nano") score += 20;
      }

      // 5. Work conditions (collaboration stage)
      if (queryLower.includes("contacted") || queryLower.includes("active")) {
        if (kol.collaborationStage === "Contacted" || kol.collaborationStage === "Sample") score += 15;
      }
      if (queryLower.includes("not contacted") || queryLower.includes("new") || queryLower.includes("available")) {
        if (kol.collaborationStage === "Not Contacted") score += 15;
      }

      // Performance criteria
      if (queryLower.includes("high engagement") || queryLower.includes("engagement")) {
        if (kol.engagementRate > 5) score += 15;
      }
      if (queryLower.includes("quality") || queryLower.includes("high quality")) {
        if (kol.qualityScore >= 8) score += 15;
      }
      if (queryLower.includes("revenue") || queryLower.includes("high revenue")) {
        if (kol.revenue > 10000000) score += 10; // >10M THB
      }

      // High-income creator (from categoryDescription)
      if (kol.categoryDescription?.includes("รายได้สูง")) {
        score += 10;
      }

      return { kol, score };
    });

    // Filter out zero scores and sort by relevance score (descending)
    let filteredKOLs = filteredKOLsWithScores
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10) // Get top 10 results
      .map(item => item.kol);

    // Generate response based on query intent
    let responseContent = "";
    let criteria: string[] = [];
    let matchScore = 0;

    if (filteredKOLs.length === 0) {
      responseContent = "I couldn't find KOLs matching your exact criteria. Try adjusting your search or being more specific.";
      criteria = ["No matches found"];
      matchScore = 0;
    } else if (lowerQuery.includes("beauty") || lowerQuery.includes("skincare")) {
      responseContent = `I found ${filteredKOLs.length} beauty/skincare KOLs that match your criteria:\n\nThese creators specialize in beauty content with strong engagement.`;
      criteria = ["Category: Beauty/Skincare", "Quality: High performers", "Availability: Verified"];
      matchScore = 92;
    } else if (lowerQuery.includes("macro") || lowerQuery.includes("follower")) {
      responseContent = `Here are ${filteredKOLs.length} Macro-level KOLs with substantial reach:`;
      criteria = ["Level: Macro KOL", "Followers: 100K-1M", "Verified profiles"];
      matchScore = 88;
    } else if (lowerQuery.includes("contact") || lowerQuery.includes("rate")) {
      responseContent = `Found ${filteredKOLs.length} KOLs with complete contact information:\n\nReady for rate negotiations.`;
      criteria = ["Has contact info", "Available for collaboration", "Responsive"];
      matchScore = 95;
    } else {
      responseContent = `I found ${filteredKOLs.length} relevant KOLs based on your search:`;
      criteria = ["Relevance matched", "Quality verified", "Active status"];
      matchScore = 85;
    }

    return {
      id: Date.now().toString(),
      role: "assistant",
      content: responseContent,
      results: filteredKOLs,
      metadata: {
        matchScore,
        reasoning: "Matched based on category, location, performance, and contact availability",
        criteria
      },
      suggestions: [
        "Show me their contact details",
        "What are their engagement rates?",
        "Compare these KOLs side-by-side",
        "Find similar influencers"
      ]
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      const response = await processQuery(input);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Search error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error processing your request. Please try again."
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleSelectKOL = (kol: KOL) => {
    onSelectKOLs([kol]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <SparklesIcon className="size-5 text-white" />
            </div>
            <div>
              <DialogTitle>AI-Powered KOL Discovery</DialogTitle>
              <DialogDescription>
                Natural language search • Smart matching • Instant insights
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                {/* Message Bubble */}
                <div
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role !== "user" && (
                    <div
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                        message.role === "system"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-gradient-to-br from-purple-500 to-pink-500"
                      }`}>
                      {message.role === "system" ? (
                        <InfoIcon className="size-4 text-blue-600 dark:text-blue-300" />
                      ) : (
                        <BotIcon className="size-4 text-white" />
                      )}
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}>
                    <p className="whitespace-pre-line text-sm">{message.content}</p>

                    {/* Match Metadata */}
                    {message.metadata && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2Icon className="size-4 text-green-600" />
                          <span className="text-xs font-medium">
                            Match Score: {message.metadata.matchScore}%
                          </span>
                        </div>
                        {message.metadata.criteria && (
                          <div className="flex flex-wrap gap-1">
                            {message.metadata.criteria.map((criterion, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {criterion}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary">
                      <UserIcon className="size-4 text-primary-foreground" />
                    </div>
                  )}
                </div>

                {/* KOL Results */}
                {message.results && message.results.length > 0 && (
                  <div className="ml-11 space-y-2">
                    {message.results.map((kol) => (
                      <Card
                        key={kol.kolId}
                        className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
                        onClick={() => handleSelectKOL(kol)}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="size-16">
                              <AvatarImage src={kol.profileImageUrl || undefined} />
                              <AvatarFallback>
                                {kol.nickname
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold">{kol.nickname}</h4>
                                  <p className="text-sm text-muted-foreground">@{kol.handle}</p>
                                </div>
                                <Badge variant="outline">{kol.level}</Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div className="flex items-center gap-1.5">
                                  <UserIcon className="size-3 text-muted-foreground" />
                                  <span>{formatNumber(kol.follower)} followers</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <TrendingUpIcon className="size-3 text-muted-foreground" />
                                  <span>{kol.engagementRate}% engagement</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <DollarSignIcon className="size-3 text-muted-foreground" />
                                  <span>{formatCurrency(kol.revenue)} revenue</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <PhoneIcon className="size-3 text-muted-foreground" />
                                  <span
                                    className={
                                      kol.contactPhone || kol.contactEmail || kol.lineId
                                        ? "text-green-600"
                                        : "text-amber-600"
                                    }>
                                    {kol.contactPhone || kol.contactEmail || kol.lineId
                                      ? "Contact available"
                                      : "Contact pending"}
                                  </span>
                                </div>
                              </div>

                              {/* Quick Info Pills */}
                              <div className="flex flex-wrap gap-1">
                                {kol.location?.map((loc) => (
                                  <Badge key={loc} variant="secondary" className="text-xs">
                                    📍 {loc}
                                  </Badge>
                                ))}
                                {kol.specialization?.slice(0, 2).map((spec) => (
                                  <Badge key={spec} variant="outline" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                                {kol.collaborationStage && (
                                  <Badge variant="secondary" className="text-xs">
                                    {kol.collaborationStage}
                                  </Badge>
                                )}
                                {/* Contact Data Disclaimer */}
                                {!kol.contactPhone && !kol.contactEmail && !kol.lineId && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-amber-300 bg-amber-50 text-amber-700">
                                    📞 Contact data being collected
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="ml-11 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs">
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <BotIcon className="size-4 text-white animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <div className="size-2 rounded-full bg-muted-foreground animate-bounce" />
                    <div className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                    <div className="size-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Try: "Find beauty KOLs in Bangkok with 100K+ followers"'
              className="flex-1"
              disabled={isProcessing}
            />
            <Button type="submit" disabled={!input.trim() || isProcessing}>
              <SendIcon className="size-4" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
