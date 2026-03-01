import { MapPin, TrendingUp, ChevronRight } from "lucide-react";
import { LgaPledgeData, WardPledgeData } from "@/data/kanoPledgeData";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MapBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: LgaPledgeData | null;
}

const WardRow = ({ ward }: { ward: WardPledgeData }) => {
  const progress = Math.min(100, (ward.pledges / ward.target) * 100);
  return (
    <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
      <div className="flex-1 min-w-0">
        <p className="font-heading font-semibold text-sm text-foreground truncate">{ward.ward}</p>
        <div className="w-full bg-muted rounded-full h-1.5 mt-1">
          <div
            className="bg-gradient-primary h-1.5 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="font-heading font-bold text-sm text-foreground">{ward.pledges.toLocaleString()}</p>
        <p className="text-[10px] text-primary font-semibold flex items-center gap-0.5 justify-end">
          <TrendingUp size={9} />
          {ward.growth}
        </p>
      </div>
    </div>
  );
};

const MapBottomSheet = ({ open, onOpenChange, data }: MapBottomSheetProps) => {
  if (!data) return null;

  const progress = Math.min(100, (data.pledges / data.target) * 100);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 font-heading">
            <MapPin size={18} className="text-primary" />
            {data.lga}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">Pledges</p>
              <p className="font-heading font-bold text-xl text-foreground">{data.pledges.toLocaleString()}</p>
            </div>
            <div className="bg-muted rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground">Growth</p>
              <p className="font-heading font-bold text-xl text-primary flex items-center justify-center gap-1">
                <TrendingUp size={16} />
                {data.growth}
              </p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress to target</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-gradient-primary h-2.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Target: {data.target.toLocaleString()} pledges
            </p>
          </div>

          {/* Ward breakdown */}
          {data.wards && data.wards.length > 0 && (
            <div>
              <h4 className="font-heading font-bold text-sm text-foreground mb-2 flex items-center gap-1">
                <ChevronRight size={14} className="text-primary" />
                Wards in {data.lga} ({data.wards.length})
              </h4>
              <div className="space-y-2">
                {data.wards
                  .sort((a, b) => b.pledges - a.pledges)
                  .map((ward) => (
                    <WardRow key={ward.ward} ward={ward} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MapBottomSheet;
