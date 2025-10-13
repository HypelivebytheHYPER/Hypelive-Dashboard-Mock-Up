"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { generateAvatarFallback } from "@/lib/utils";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const connections = [
  {
    name: "Nattaya Sanitwong",
    email: "nattaya.sanitwong@example.com",
    avatar: `https://bundui-images.netlify.app/avatars/01.png`,
    status: "connect"
  },
  {
    name: "Somchai Suwanprasert",
    email: "somchai.suwanprasert@example.com",
    avatar: `https://bundui-images.netlify.app/avatars/02.png`,
    status: "disconnect"
  },
  {
    name: "Siriporn Wattana",
    email: "siriporn.wattana@example.com",
    avatar: `https://bundui-images.netlify.app/avatars/03.png`,
    status: "connect"
  },
  {
    name: "Apinya Maneerat",
    email: "apinya.maneerat@example.com",
    avatar: `https://bundui-images.netlify.app/avatars/05.png`,
    status: "disconnect"
  },
  {
    name: "Nattapong Charoensuk",
    email: "nattapong.charoensuk@example.com",
    avatar: `https://bundui-images.netlify.app/avatars/06.png`,
    status: "disconnect"
  }
];

export function Connections() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connections</CardTitle>
        <CardAction>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <ChevronRight />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View All</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {connections.map((item, key) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={item.avatar} alt="@hypelive" />
                  <AvatarFallback>{generateAvatarFallback(item.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-muted-foreground text-xs">{item.email}</div>
                </div>
              </div>
              {item.status === "disconnect" ? (
                <Button variant="outline" size="sm">
                  Disconnect
                </Button>
              ) : (
                <Button size="sm">Connect</Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
