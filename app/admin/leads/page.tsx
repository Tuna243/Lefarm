'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Lead {
  id: string
  name: string
  email?: string
  phone: string
  subject: string
  message: string
  status: 'new' | 'contacted' | 'consulting' | 'closed'
  notes?: string
  contactedAt?: string
  createdAt: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const url = filterStatus === 'all' 
        ? '/api/leads'
        : `/api/leads?status=${filterStatus}`
      const response = await fetch(url)
      const data = await response.json()
      setLeads(data)
    } catch (error) {
      console.error('Error fetching leads:', error)
      toast.error('Không thể tải danh sách liên hệ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update')

      setLeads(leads.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus as Lead['status'] } : lead
      ))
      toast.success('Cập nhật trạng thái thành công')
    } catch (error) {
      console.error('Error updating lead:', error)
      toast.error('Cập nhật trạng thái thất bại')
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery)
    return matchesSearch
  })

  const getStatusBadge = (status: Lead['status']) => {
    const variants: Record<Lead['status'], string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      consulting: 'bg-purple-100 text-purple-800',
      closed: 'bg-green-100 text-green-800',
    }

    const labels: Record<Lead['status'], string> = {
      new: 'Mới',
      contacted: 'Đã liên hệ',
      consulting: 'Đang tư vấn',
      closed: 'Đã chốt',
    }

    return (
      <Badge className={variants[status]}>
        {labels[status]}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý Liên hệ</h1>
        <p className="text-muted-foreground">Theo dõi và xử lý các yêu cầu từ khách hàng</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Tìm kiếm theo tên, email, SĐT..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={filterStatus} onValueChange={(value) => {
          setFilterStatus(value)
          setIsLoading(true)
        }}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="new">Mới</SelectItem>
            <SelectItem value="contacted">Đã liên hệ</SelectItem>
            <SelectItem value="consulting">Đang tư vấn</SelectItem>
            <SelectItem value="closed">Đã chốt</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={fetchLeads} variant="outline">
          Làm mới
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Chủ đề</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email || '-'}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell className="max-w-xs truncate">{lead.subject}</TableCell>
                    <TableCell>
                      <Select value={lead.status} onValueChange={(value) => handleStatusChange(lead.id, value)}>
                        <SelectTrigger className="w-fit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Mới</SelectItem>
                          <SelectItem value="contacted">Đã liên hệ</SelectItem>
                          <SelectItem value="consulting">Đang tư vấn</SelectItem>
                          <SelectItem value="closed">Đã chốt</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLead(lead)}
                      >
                        Xem
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Chi tiết liên hệ</h2>
            <Button variant="ghost" onClick={() => setSelectedLead(null)}>✕</Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tên</label>
                <p>{selectedLead.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p>{selectedLead.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Số điện thoại</label>
                <p>{selectedLead.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Chủ đề</label>
                <p>{selectedLead.subject}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Nội dung</label>
              <p className="mt-2 p-3 bg-muted rounded">{selectedLead.message}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Ghi chú</label>
              <Input
                placeholder="Thêm ghi chú..."
                defaultValue={selectedLead.notes || ''}
                className="mt-2"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
