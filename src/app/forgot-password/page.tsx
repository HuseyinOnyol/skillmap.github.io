'use client'

import { useState } from 'react'
import { useMockAuth as useAuth } from '@/contexts/MockAuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const result = await resetPassword(email)
    
    if (result.error) {
      setError(result.error)
    } else {
      setMessage('Şifre sıfırlama e-postası gönderildi. E-posta kutunuzu kontrol edin.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Şifre Sıfırlama
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            E-posta adresinize şifre sıfırlama linki göndereceğiz
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Şifremi Unuttum</CardTitle>
            <CardDescription>
              E-posta adresinizi girin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              {message && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                  {message}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  required
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Link 
                href="/login" 
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                ← Giriş sayfasına dön
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
