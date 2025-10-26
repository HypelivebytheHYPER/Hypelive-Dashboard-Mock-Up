"use client";

/**
 * Audience Demographics Card - Client Component
 * Requires client-side interactivity for Tabs component
 * Note: Data is static, but tabs switching needs JavaScript
 */

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersIcon, MapPinIcon, CakeIcon } from "lucide-react";

export function AudienceDemographicsCard() {
  // Mock data - in production, this would come from API
  const genderData = [
    { gender: "Female", percentage: 62, color: "bg-pink-500" },
    { gender: "Male", percentage: 35, color: "bg-blue-500" },
    { gender: "Other", percentage: 3, color: "bg-purple-500" }
  ];

  const ageData = [
    { range: "13-17", percentage: 8, color: "bg-yellow-500" },
    { range: "18-24", percentage: 45, color: "bg-green-500" },
    { range: "25-34", percentage: 28, color: "bg-blue-500" },
    { range: "35-44", percentage: 12, color: "bg-purple-500" },
    { range: "45+", percentage: 7, color: "bg-gray-500" }
  ];

  const locationData = [
    { country: "Thailand", percentage: 68, flag: "🇹🇭" },
    { country: "Vietnam", percentage: 12, flag: "🇻🇳" },
    { country: "Singapore", percentage: 8, flag: "🇸🇬" },
    { country: "Malaysia", percentage: 6, flag: "🇲🇾" },
    { country: "Others", percentage: 6, flag: "🌏" }
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon className="size-5" />
              Audience Demographics
            </CardTitle>
            <CardDescription className="mt-1">
              Average demographics across all KOLs in database
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            Based on 1,960 KOLs
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gender" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gender">Gender</TabsTrigger>
            <TabsTrigger value="age">Age Groups</TabsTrigger>
            <TabsTrigger value="location">Top Locations</TabsTrigger>
          </TabsList>

          <TabsContent value="gender" className="space-y-4">
            <div className="space-y-3">
              {genderData.map((item) => (
                <div key={item.gender} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.gender}</span>
                    <span className="text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="age" className="space-y-4">
            <div className="space-y-3">
              {ageData.map((item) => (
                <div key={item.range} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <CakeIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium">{item.range}</span>
                    </div>
                    <span className="text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${item.color} transition-all duration-500`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Primary audience:</strong> 18-34 age group represents 73% of total reach
              </p>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <div className="space-y-3">
              {locationData.map((item) => (
                <div key={item.country} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.flag}</span>
                      <span className="font-medium">{item.country}</span>
                    </div>
                    <span className="text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
              <p className="text-sm text-green-900 dark:text-green-100">
                <strong>Market coverage:</strong> 68% domestic (Thailand), 32% international reach
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
