"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function ContactPage() {
  const { t } = useI18n()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || '',
          subject: formData.get('subject') || '',
          message: formData.get('message'),
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit')
      }
      
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-linear-to-b from-muted/50 to-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{t.contact.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground">{t.contact.subtitle}</p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Contact Info */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      {t.contact.address}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Thôn Võ Kiện, Xã Diên An
                      <br />
                      Huyện Diên Khánh, Tỉnh Khánh Hòa
                      <br />
                      Việt Nam
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Phone className="h-5 w-5 text-primary" />
                      {t.contact.phone}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">079.4567.157</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Mail className="h-5 w-5 text-primary" />
                      {t.contact.emailLabel}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">lefarmkhanhhoa@gmail.com</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-primary" />
                      {t.contact.workingHours}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{t.contact.workingHoursValue}</p>
                    <p className="text-muted-foreground">Saturday: 9:00 AM - 2:00 PM</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t.contact.sendMessage}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="mt-4 text-xl font-semibold text-foreground">{t.common.success}!</h3>
                        <p className="mt-2 text-muted-foreground">
                          Thank you for contacting us. We&apos;ll get back to you within 24 hours.
                        </p>
                        <Button className="mt-6" onClick={() => setIsSubmitted(false)}>
                          {t.contact.sendMessage}
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">{t.contact.name}</Label>
                            <Input id="name" name="name" placeholder={t.contact.namePlaceholder} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">{t.contact.email}</Label>
                            <Input id="email" name="email" type="email" placeholder={t.contact.emailPlaceholder} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Điện thoại</Label>
                          <Input id="phone" name="phone" type="tel" placeholder="Nhập số điện thoại" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">{t.contact.subject}</Label>
                          <Input id="subject" name="subject" placeholder={t.contact.subjectPlaceholder} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="message">{t.contact.message}</Label>
                          <Textarea id="message" name="message" placeholder={t.contact.messagePlaceholder} rows={6} required />
                        </div>
                        <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                          {isLoading ? (
                            t.contact.sending
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              {t.contact.send}
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>

                {/* Map */}
                <div className="mt-8 overflow-hidden rounded-xl border">
                  <iframe
                    src="https://www.google.com/maps?q=Th%C3%B4n%20V%C3%B5%20Ki%E1%BB%87n%2C%20X%C3%A3%20Di%C3%AAn%20An%2C%20Huy%E1%BB%87n%20Di%C3%AAn%20Kh%C3%A1nh%2C%20T%E1%BB%89nh%20Kh%C3%A1nh%20H%C3%B2a%2C%20Vi%E1%BB%87t%20Nam&output=embed"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lefarm Khánh Hòa Location"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
