"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Copy,
  LinkIcon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useMyGroups } from "@/lib/groups/api";
import {
  useCreateApplicant,
  useCreateSelfRegLink,
  useDeleteApplicant,
  useGroupApplicants,
  useUpdateApplicant,
  type ApplicantResponse,
} from "@/lib/applicants/api";

type PageProps = { params: Promise<{ groupId: string }> };

const STATUS_VALUES = [
  "new",
  "contacted",
  "toured",
  "accepted",
  "rejected",
  "withdrawn",
] as const;

type ApplicantStatus = (typeof STATUS_VALUES)[number];

const STATUS_BADGE: Record<ApplicantStatus, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-amber-100 text-amber-700 border-amber-200",
  toured: "bg-purple-100 text-purple-700 border-purple-200",
  accepted: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-zinc-200 text-zinc-700 border-zinc-300",
  withdrawn: "bg-zinc-100 text-zinc-500 border-zinc-200",
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  status: ApplicantStatus;
  role_context: string;
  notes: string;
  budget_usd: string;
  move_in_date: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  status: "new",
  role_context: "",
  notes: "",
  budget_usd: "",
  move_in_date: "",
};

function applicantToForm(a: ApplicantResponse): FormState {
  return {
    name: a.name ?? "",
    email: a.email ?? "",
    phone: a.phone ?? "",
    status: (a.status as ApplicantStatus) ?? "new",
    role_context: a.role_context ?? "",
    notes: a.notes ?? "",
    budget_usd: a.budget_usd != null ? String(a.budget_usd) : "",
    move_in_date: a.move_in_date ?? "",
  };
}

function formToPayload(form: FormState) {
  const name = form.name.trim();
  const email = form.email.trim();
  const phone = form.phone.trim();
  const role_context = form.role_context.trim();
  const notes = form.notes.trim();
  const budget = form.budget_usd.trim();
  return {
    name: name || null,
    email: email || null,
    phone: phone || null,
    status: form.status,
    role_context: role_context || null,
    notes: notes || null,
    budget_usd: budget ? Number(budget) : null,
    move_in_date: form.move_in_date || null,
  };
}

function formatMoveIn(iso: string | null | undefined) {
  if (!iso) return "—";
  return iso;
}

function formatBudget(n: number | null | undefined) {
  if (n == null) return "—";
  return `$${n.toLocaleString()}`;
}

export default function GroupApplicantsPage(props: PageProps) {
  const { groupId } = use(props.params);
  const myGroupsQuery = useMyGroups();
  const group = useMemo(
    () => myGroupsQuery.data?.groups.find((g) => g.id === groupId) ?? null,
    [myGroupsQuery.data, groupId],
  );

  const applicantsQuery = useGroupApplicants(groupId);
  const createApplicant = useCreateApplicant(groupId);
  const updateApplicant = useUpdateApplicant(groupId);
  const deleteApplicant = useDeleteApplicant(groupId);
  const createSelfRegLink = useCreateSelfRegLink(groupId);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<FormState>(EMPTY_FORM);
  const [editing, setEditing] = useState<ApplicantResponse | null>(null);
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkRoleContext, setLinkRoleContext] = useState("");

  const applicants = applicantsQuery.data?.applicants ?? [];
  const visibleApplicants = applicants.filter(
    (a) => a.source !== "self_registration" || a.name || a.email,
  );
  const pendingLinks = applicants.filter(
    (a) =>
      a.source === "self_registration" &&
      !a.name &&
      !a.email &&
      a.has_pending_self_reg,
  );

  async function handleAdd() {
    const payload = formToPayload(addForm);
    if (!payload.name && !payload.email) {
      toast.error("Name or email is required");
      return;
    }
    try {
      await createApplicant.mutateAsync(payload);
      setAddOpen(false);
      setAddForm(EMPTY_FORM);
      toast.success("Applicant added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Add failed");
    }
  }

  async function handleEditSave() {
    if (!editing) return;
    const payload = formToPayload(editForm);
    try {
      await updateApplicant.mutateAsync({
        applicantId: editing.id,
        body: payload,
      });
      setEditing(null);
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  }

  async function handleStatusChange(a: ApplicantResponse, status: ApplicantStatus) {
    try {
      await updateApplicant.mutateAsync({
        applicantId: a.id,
        body: { status },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  }

  async function handleDelete(a: ApplicantResponse) {
    const label = a.name || a.email || "this applicant";
    if (!confirm(`Remove ${label}?`)) return;
    try {
      await deleteApplicant.mutateAsync(a.id);
      toast.success("Removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Remove failed");
    }
  }

  async function handleCreateLink() {
    try {
      const res = await createSelfRegLink.mutateAsync({
        role_context: linkRoleContext.trim() || null,
      });
      await navigator.clipboard.writeText(res.url);
      setLinkOpen(false);
      setLinkRoleContext("");
      toast.success("Share link copied to clipboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create link");
    }
  }

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  if (myGroupsQuery.isLoading) {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <Skeleton className="h-8 w-60" />
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="h-full w-full overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
          <Link href="/groups" className="text-sm text-muted-foreground">
            <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
            Groups
          </Link>
          <p className="mt-6">Group not found or you&apos;re not a member.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <Link
          href={`/groups/${groupId}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="mr-1 inline h-3.5 w-3.5" />
          {group.name}
        </Link>

        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Applicants</h1>
            <p className="text-sm text-muted-foreground">
              Track people interested in joining {group.name}.
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LinkIcon className="h-4 w-4" />
                  Generate share link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create self-registration link</DialogTitle>
                  <DialogDescription>
                    Single-use, expires in 30 days. The applicant fills their own
                    details — no signup required.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-2">
                  <Label htmlFor="link-role">What are they applying for?</Label>
                  <Input
                    id="link-role"
                    placeholder="e.g. 3rd housemate — new 3BR"
                    value={linkRoleContext}
                    onChange={(e) => setLinkRoleContext(e.target.value)}
                    maxLength={255}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional — shown on the form so the applicant knows the role.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setLinkOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateLink}
                    disabled={createSelfRegLink.isPending}
                  >
                    Create & copy link
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => setAddForm(EMPTY_FORM)}>
                  <Plus className="h-4 w-4" />
                  Add applicant
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add applicant</DialogTitle>
                </DialogHeader>
                <ApplicantFormFields form={addForm} setForm={setAddForm} />
                <DialogFooter>
                  <Button variant="ghost" onClick={() => setAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd} disabled={createApplicant.isPending}>
                    Add
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator className="my-6" />

        {pendingLinks.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">
                Pending self-registration links
              </CardTitle>
              <CardDescription>
                Links you&apos;ve shared but nobody has submitted yet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingLinks.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-2 rounded border px-3 py-2 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        link
                      </Badge>
                      <span className="truncate">
                        {a.role_context || "No role specified"}
                      </span>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {a.self_reg_url}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyLink(a.self_reg_url!)}
                      aria-label="Copy"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(a)}
                      aria-label="Revoke"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {visibleApplicants.length} applicant
              {visibleApplicants.length === 1 ? "" : "s"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicantsQuery.isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : visibleApplicants.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No applicants yet. Add one manually or share a registration link.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Move-in</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleApplicants.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">
                        {a.name || <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell className="text-xs">
                        <div>{a.email || "—"}</div>
                        {a.phone && (
                          <div className="text-muted-foreground">{a.phone}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {a.role_context || "—"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={a.status}
                          onValueChange={(v) =>
                            handleStatusChange(a, v as ApplicantStatus)
                          }
                        >
                          <SelectTrigger
                            size="sm"
                            className={`h-7 w-32 text-xs ${STATUS_BADGE[a.status as ApplicantStatus] ?? ""}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_VALUES.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatBudget(a.budget_usd)}
                      </TableCell>
                      <TableCell className="text-xs">
                        {formatMoveIn(a.move_in_date)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">
                          {a.source === "self_registration" ? "self-reg" : "manual"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditing(a);
                              setEditForm(applicantToForm(a));
                            }}
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(a)}
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog
          open={editing !== null}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit applicant</DialogTitle>
              {editing?.notes && (
                <DialogDescription className="whitespace-pre-wrap">
                  {editing.notes}
                </DialogDescription>
              )}
            </DialogHeader>
            <ApplicantFormFields form={editForm} setForm={setEditForm} />
            <DialogFooter>
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave} disabled={updateApplicant.isPending}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ApplicantFormFields({
  form,
  setForm,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
}) {
  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm({ ...form, [key]: value });
  }
  return (
    <div className="grid grid-cols-1 gap-3 py-2 sm:grid-cols-2">
      <div className="space-y-1">
        <Label htmlFor="f-name">Name</Label>
        <Input
          id="f-name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          maxLength={255}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="f-email">Email</Label>
        <Input
          id="f-email"
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          maxLength={255}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="f-phone">Phone</Label>
        <Input
          id="f-phone"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          maxLength={64}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="f-status">Status</Label>
        <Select
          value={form.status}
          onValueChange={(v) => set("status", v as ApplicantStatus)}
        >
          <SelectTrigger id="f-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_VALUES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1 sm:col-span-2">
        <Label htmlFor="f-role">Role / opening</Label>
        <Input
          id="f-role"
          placeholder="e.g. master bedroom — old apt"
          value={form.role_context}
          onChange={(e) => set("role_context", e.target.value)}
          maxLength={255}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="f-budget">Budget (USD)</Label>
        <Input
          id="f-budget"
          type="number"
          min={0}
          value={form.budget_usd}
          onChange={(e) => set("budget_usd", e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="f-movein">Move-in date</Label>
        <Input
          id="f-movein"
          type="date"
          value={form.move_in_date}
          onChange={(e) => set("move_in_date", e.target.value)}
        />
      </div>
      <div className="space-y-1 sm:col-span-2">
        <Label htmlFor="f-notes">Notes</Label>
        <Textarea
          id="f-notes"
          rows={4}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>
    </div>
  );
}
