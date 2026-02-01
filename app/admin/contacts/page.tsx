"use client"

import { Suspense, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, MoreHorizontal, Eye, Mail, CheckCircle, Trash2, Send } from "lucide-react"

type Lead = {
  id: string | number
  name: string
  email: string | null
  phone: string | null
  subject: string | null
  message: string
  status: string | null
  createdAt: string
}

function ContactsContent() {
  const [contacts, setContacts] = useState<Lead[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedContact, setSelectedContact] = useState<(typeof contacts)[0] | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [replySubject, setReplySubject] = useState("Re: Your inquiry to LeFarm")
  const [replyBody, setReplyBody] = useState("")
  const [sending, setSending] = useState(false)
  const [replyError, setReplyError] = useState<string | null>(null)
  const [replySuccess, setReplySuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchContacts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/leads")

        if (!response.ok) {
          throw new Error("Failed to load submissions")
        }

        const data = await response.json()
        if (isMounted) {
          setContacts(data)
          setError(null)
        }
      } catch (err) {
        console.error("Error loading contact submissions", err)
        if (isMounted) {
          setError("Không thể tải danh sách liên hệ")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchContacts()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      (contact.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (contact.subject || "").toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || (contact.status || "").toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const newCount = contacts.filter((c) => (c.status || "").toLowerCase() === "new").length
  const repliedCount = contacts.filter((c) => (c.status || "").toLowerCase() === "replied").length

  const handleView = (contact: (typeof contacts)[0]) => {
    setSelectedContact(contact)
    setIsViewOpen(true)
  }

  const handleReply = (contact: (typeof contacts)[0]) => {
    setSelectedContact(contact)
    setReplySubject(`Re: ${contact.subject || "Your inquiry"}`)
    setReplyBody("")
    setReplyError(null)
    setReplySuccess(false)
    setIsReplyOpen(true)
  }

  const handleSendReply = async () => {
    if (!selectedContact?.email) {
      setReplyError("Lead không có email để gửi trả lời")
      return
    }

    try {
      setSending(true)
      setReplyError(null)
      setReplySuccess(false)

      const response = await fetch(`/api/leads/${selectedContact.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: replySubject, message: replyBody }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || "Không thể gửi email")
      }

      setReplySuccess(true)
      setIsReplyOpen(false)

      // Refresh contacts to update status
      setContacts((prev) =>
        prev.map((c) => (c.id === selectedContact.id ? { ...c, status: "replied" } : c))
      )
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Không thể gửi email")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Contact Submissions</h1>
        <p className="text-muted-foreground">Manage contact form submissions and inquiries</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-2xl font-bold text-foreground">{contacts.length}</p>
              </div>
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New / Pending</p>
                <p className="text-2xl font-bold text-primary">{newCount}</p>
              </div>
              <Badge className="bg-primary/10 text-primary">Needs Review</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Replied</p>
                <p className="text-2xl font-bold text-foreground">{repliedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("new")}
              >
                New ({newCount})
              </Button>
              <Button
                variant={statusFilter === "replied" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("replied")}
              >
                Replied
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Message Preview</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Loading submissions...
                  </TableCell>
                </TableRow>
              )}

              {!loading && error && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-destructive-foreground">
                    {error}
                  </TableCell>
                </TableRow>
              )}

              {!loading && !error && filteredContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Chưa có liên hệ nào.
                  </TableCell>
                </TableRow>
              )}

              {!loading && !error && filteredContacts.map((contact) => {
                const status = (contact.status || "new").toLowerCase()
                const createdAt = contact.createdAt ? new Date(contact.createdAt) : null

                return (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.email || "No email"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-1 max-w-md text-sm text-muted-foreground">{contact.message}</p>
                    </TableCell>
                    <TableCell>
                      {createdAt
                        ? createdAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={status === "new" ? "default" : "secondary"}
                        className={status === "new" ? "bg-primary/10 text-primary" : ""}
                      >
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(contact)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReply(contact)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Replied
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive-foreground">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>Submission from {selectedContact?.name}</DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-foreground">{selectedContact.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-foreground">{selectedContact.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-foreground">{selectedContact.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-foreground">
                    {selectedContact.createdAt
                      ? new Date(selectedContact.createdAt).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Message</p>
                <p className="mt-1 rounded-lg bg-muted p-3 text-foreground">{selectedContact.message}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewOpen(false)
                if (selectedContact) handleReply(selectedContact)
              }}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to {selectedContact?.name}</DialogTitle>
            <DialogDescription>Send a response to {selectedContact?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm font-medium text-muted-foreground">Original Message:</p>
              <p className="mt-1 text-sm text-foreground">{selectedContact?.message}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reply">Your Reply</Label>
              <Textarea
                id="reply"
                placeholder="Type your response here..."
                rows={6}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
              />
            </div>
            {replyError && <p className="text-sm text-destructive-foreground">{replyError}</p>}
            {replySuccess && <p className="text-sm text-emerald-600">Đã gửi email phản hồi.</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply} className="gap-2" disabled={sending}>
              <Send className="h-4 w-4" />
              {sending ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ContactsPage() {
  return (
    <Suspense fallback={null}>
      <ContactsContent />
    </Suspense>
  )
}
