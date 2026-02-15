import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

export interface ContentFormData {
  id?: string;
  title: string;
  type: string;
  content: string;
  image_url: string;
  status: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ContentFormData) => void;
  initialData?: ContentFormData | null;
  isPending: boolean;
}

const emptyForm: ContentFormData = {
  title: "",
  type: "news",
  content: "",
  image_url: "",
  status: "draft",
};

export function ContentFormDialog({ open, onOpenChange, onSubmit, initialData, isPending }: Props) {
  const [form, setForm] = useState<ContentFormData>(emptyForm);

  useEffect(() => {
    if (open) setForm(initialData ?? emptyForm);
  }, [open, initialData]);

  const isEdit = !!initialData?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading">{isEdit ? "Edit Content" : "New Content"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Enter title..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="gallery">Gallery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Write content..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (optional)</Label>
            <Input
              id="image_url"
              value={form.image_url}
              onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => onSubmit(form)}
            disabled={!form.title.trim() || isPending}
            className="font-heading font-semibold"
          >
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
