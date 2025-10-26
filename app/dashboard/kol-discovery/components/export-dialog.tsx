"use client";

import * as React from "react";
import { DownloadIcon, FileSpreadsheetIcon, FileTextIcon, FileJsonIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { type KOL } from "@/lib/utils/kol-transform";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kols: KOL[];
  totalCount: number;
}

type ExportFormat = "csv" | "json" | "xlsx";

const EXPORT_FIELDS = [
  { id: "basic", label: "Basic Info", description: "Name, handle, ID", default: true },
  { id: "metrics", label: "Performance Metrics", description: "Followers, engagement, revenue", default: true },
  { id: "contact", label: "Contact Information", description: "Email, phone, Line ID", default: false },
  { id: "classification", label: "Classification", description: "Level, type, categories", default: true },
  { id: "location", label: "Location", description: "Geographic data", default: true },
  { id: "collaboration", label: "Collaboration", description: "Stage, rates, conditions", default: false },
  { id: "urls", label: "Social URLs", description: "TikTok, Instagram, etc.", default: false }
] as const;

export function ExportDialog({ open, onOpenChange, kols, totalCount }: ExportDialogProps) {
  const [format, setFormat] = React.useState<ExportFormat>("csv");
  const [selectedFields, setSelectedFields] = React.useState<string[]>(
    EXPORT_FIELDS.filter(f => f.default).map(f => f.id)
  );
  const [isExporting, setIsExporting] = React.useState(false);

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const selectAll = () => {
    setSelectedFields(EXPORT_FIELDS.map(f => f.id));
  };

  const deselectAll = () => {
    setSelectedFields([]);
  };

  const generateCSV = (data: KOL[]): string => {
    const headers: string[] = [];
    const rows: string[][] = [];

    // Build headers based on selected fields
    if (selectedFields.includes("basic")) {
      headers.push("KOL ID", "Nickname", "Handle");
    }
    if (selectedFields.includes("metrics")) {
      headers.push("Followers", "Engagement Rate", "Revenue (THB)", "Views", "Quality Score");
    }
    if (selectedFields.includes("contact")) {
      headers.push("Email", "Phone", "Line ID");
    }
    if (selectedFields.includes("classification")) {
      headers.push("Level", "Type", "Specialization");
    }
    if (selectedFields.includes("location")) {
      headers.push("Location");
    }
    if (selectedFields.includes("collaboration")) {
      headers.push("Collaboration Stage", "Internal Contact");
    }
    if (selectedFields.includes("urls")) {
      headers.push("TikTok URL", "Instagram URL", "YouTube URL");
    }

    // Build rows
    data.forEach(kol => {
      const row: string[] = [];

      if (selectedFields.includes("basic")) {
        row.push(kol.kolId, `"${kol.nickname}"`, kol.handle);
      }
      if (selectedFields.includes("metrics")) {
        row.push(
          kol.follower.toString(),
          kol.engagementRate.toFixed(2),
          kol.revenue.toString(),
          kol.views.toString(),
          kol.qualityScore.toString()
        );
      }
      if (selectedFields.includes("contact")) {
        row.push(
          kol.contactEmail || "N/A",
          kol.contactPhone || "N/A",
          kol.lineId || "N/A"
        );
      }
      if (selectedFields.includes("classification")) {
        row.push(
          kol.level,
          kol.kolType,
          `"${kol.specialization?.join(", ") || "N/A"}"`
        );
      }
      if (selectedFields.includes("location")) {
        row.push(`"${kol.location?.join(", ") || "N/A"}"`);
      }
      if (selectedFields.includes("collaboration")) {
        row.push(
          kol.collaborationStage || "N/A",
          kol.internalContact || "N/A"
        );
      }
      if (selectedFields.includes("urls")) {
        row.push(
          kol.tiktokUrl || "N/A",
          kol.instagramUrl || "N/A",
          kol.youtubeUrl || "N/A"
        );
      }

      rows.push(row);
    });

    // Combine headers and rows
    return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
  };

  const generateJSON = (data: KOL[]): string => {
    const exportData = data.map(kol => {
      const obj: any = {};

      if (selectedFields.includes("basic")) {
        obj.kolId = kol.kolId;
        obj.nickname = kol.nickname;
        obj.handle = kol.handle;
      }
      if (selectedFields.includes("metrics")) {
        obj.followers = kol.follower;
        obj.engagementRate = kol.engagementRate;
        obj.revenue = kol.revenue;
        obj.views = kol.views;
        obj.qualityScore = kol.qualityScore;
      }
      if (selectedFields.includes("contact")) {
        obj.contactEmail = kol.contactEmail;
        obj.contactPhone = kol.contactPhone;
        obj.lineId = kol.lineId;
      }
      if (selectedFields.includes("classification")) {
        obj.level = kol.level;
        obj.type = kol.kolType;
        obj.specialization = kol.specialization;
      }
      if (selectedFields.includes("location")) {
        obj.location = kol.location;
      }
      if (selectedFields.includes("collaboration")) {
        obj.collaborationStage = kol.collaborationStage;
        obj.internalContact = kol.internalContact;
      }
      if (selectedFields.includes("urls")) {
        obj.tiktokUrl = kol.tiktokUrl;
        obj.instagramUrl = kol.instagramUrl;
        obj.youtubeUrl = kol.youtubeUrl;
      }

      return obj;
    });

    return JSON.stringify(exportData, null, 2);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === "csv") {
        content = generateCSV(kols);
        filename = `kol-export-${new Date().toISOString().split("T")[0]}.csv`;
        mimeType = "text/csv";
      } else if (format === "json") {
        content = generateJSON(kols);
        filename = `kol-export-${new Date().toISOString().split("T")[0]}.json`;
        mimeType = "application/json";
      } else {
        // XLSX format - for now, fallback to CSV (can be enhanced later)
        content = generateCSV(kols);
        filename = `kol-export-${new Date().toISOString().split("T")[0]}.csv`;
        mimeType = "text/csv";
      }

      // Create download link
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Close dialog after export
      setTimeout(() => {
        onOpenChange(false);
      }, 500);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export KOL Data</DialogTitle>
          <DialogDescription>
            Export {kols.length} of {totalCount} total KOLs in your preferred format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer font-normal">
                  <FileSpreadsheetIcon className="size-4" />
                  CSV (Comma-separated values)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer font-normal">
                  <FileJsonIcon className="size-4" />
                  JSON (JavaScript Object Notation)
                </Label>
              </div>
              <div className="flex items-center space-x-2 opacity-50">
                <RadioGroupItem value="xlsx" id="xlsx" disabled />
                <Label htmlFor="xlsx" className="flex items-center gap-2 font-normal">
                  <FileTextIcon className="size-4" />
                  XLSX (Excel) - Coming soon
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Fields to Export</Label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={deselectAll}>
                  Deselect All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
              {EXPORT_FIELDS.map(field => (
                <div key={field.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor={field.id}
                      className="text-sm font-medium leading-none cursor-pointer">
                      {field.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{field.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Info */}
          <div className="bg-muted rounded-lg p-4 text-sm">
            <div className="flex items-start gap-2">
              <div className="text-muted-foreground">
                📊 <strong>{kols.length} KOLs</strong> will be exported with{" "}
                <strong>{selectedFields.length} field groups</strong>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting || selectedFields.length === 0}
              className="gap-2">
              <DownloadIcon className="size-4" />
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
