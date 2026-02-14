import { MapPin, TrendingUp } from "lucide-react";
import { StatePledgeData } from "@/data/nigeriaPledgeData";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface MapBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: StatePledgeData | null;
}

const MapBottomSheet = ({ open, onOpenChange, data }: MapBottomSheetProps) => {
  if (!data) return null;

  const progress = Math.min(100, (data.pledges / data.target) * 100);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 font-heading">
            <MapPin size={18} className="text-primary" />
            {data.state}
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-4">
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MapBottomSheet;
