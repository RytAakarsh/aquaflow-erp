import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

const ModulePlaceholder = ({ title, description }: { title: string; description: string }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground font-heading">{title}</h1>
      <p className="text-muted-foreground text-sm mt-1">{description}</p>
    </div>
    <Card className="shadow-card border-border/50">
      <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
          <Construction className="w-7 h-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-lg">Module Coming Soon</p>
          <p className="text-muted-foreground text-sm mt-1 max-w-md">
            This module is under development. Full features will be available in the next release.
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export const Breeding = () => <ModulePlaceholder title="Breeding Management" description="Broodstock tracking, egg production logs, and hatch rates" />;
export const Hatchery = () => <ModulePlaceholder title="Hatchery Module" description="Tank management, survival tracking, and feeding schedules" />;
export const Nursery = () => <ModulePlaceholder title="Nursery Module" description="Batch tracking, growth logs, and transfer tracking" />;
export const Processing = () => <ModulePlaceholder title="Processing Module" description="Intake records, weight grading, output products, waste tracking" />;
export const Inventory = () => <ModulePlaceholder title="Inventory System" description="Feed & medicine tracking with auto low-stock alerts" />;
export const Finance = () => <ModulePlaceholder title="Finance Module" description="Cost tracking, farmer payments, and profit reports" />;
export const Analytics = () => <ModulePlaceholder title="Analytics Dashboard" description="Mortality rate, growth trends, best farmers, ROI analysis" />;
export const Alerts = () => <ModulePlaceholder title="Alerts System" description="Low feed, disease, and harvest alerts" />;
