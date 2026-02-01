import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Track a page visit
export async function POST(req: NextRequest) {
  try {
    const { page } = await req.json()

    if (!page) {
      return NextResponse.json(
        { error: 'Page is required' },
        { status: 400 }
      )
    }

    // Create visit record
    const visit = await prisma.pageVisit.create({
      data: {
        path: page,
      },
    })

    return NextResponse.json(visit)
  } catch (error) {
    console.error('Error tracking visit:', error)
    return NextResponse.json(
      { error: 'Failed to track visit' },
      { status: 500 }
    )
  }
}

// GET - Get visit statistics (monthly or by page)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'monthly' // monthly, byPage, daily
    const page = searchParams.get('page') // optional: filter by page
    const months = parseInt(searchParams.get('months') || '6') // default 6 months
    const now = new Date()

    if (type === 'monthly') {
      // Get all visits from the last N months
      const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1)

      const visits = await prisma.pageVisit.findMany({
        where: {
          timestamp: {
            gte: startDate,
          },
          ...(page && { path: page }),
        },
        select: {
          timestamp: true,
        },
        orderBy: {
          timestamp: 'asc',
        },
      })

      // Group by month
      const monthlyData: Record<string, number> = {}

      // Initialize months with zero
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const monthKey = date.toLocaleString('default', { month: 'short' })
        monthlyData[monthKey] = 0
      }

      // Count visits by month
      visits.forEach((visit) => {
        const date = new Date(visit.timestamp)
        const monthKey = date.toLocaleString('default', { month: 'short' })
        if (monthlyData.hasOwnProperty(monthKey)) {
          monthlyData[monthKey]++
        }
      })

      const result = Object.entries(monthlyData).map(([month, visits]) => ({
        month,
        visits,
      }))

      return NextResponse.json(result)
    } else if (type === 'byPage') {
      // Get total visits grouped by page
      const visits = await prisma.pageVisit.findMany({
        select: {
          path: true,
        },
      })

      const pageVisits: Record<string, number> = {}
      visits.forEach((visit) => {
        pageVisits[visit.path] = (pageVisits[visit.path] || 0) + 1
      })

      const result = Object.entries(pageVisits)
        .map(([page, visits]) => ({
          page,
          visits,
        }))
        .sort((a, b) => b.visits - a.visits)

      return NextResponse.json(result)
    } else if (type === 'daily') {
      // Get daily visit counts for the last N days
      const days = parseInt(searchParams.get('days') || '30')
      const startDate = new Date(now)
      startDate.setDate(startDate.getDate() - days)

      const visits = await prisma.pageVisit.findMany({
        where: {
          timestamp: {
            gte: startDate,
          },
          ...(page && { path: page }),
        },
        select: {
          timestamp: true,
        },
        orderBy: {
          timestamp: 'asc',
        },
      })

      // Group by day
      const dailyData: Record<string, number> = {}

      visits.forEach((visit) => {
        const dateKey = visit.timestamp.toISOString().split('T')[0]
        dailyData[dateKey] = (dailyData[dateKey] || 0) + 1
      })

      const result = Object.entries(dailyData)
        .map(([date, visits]) => ({
          date,
          visits,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Invalid type parameter' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
