'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Info, Copy, Check } from 'lucide-react'

export function DemoInfo() {
  const [isVisible, setIsVisible] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  const demoAccounts = [
    {
      role: 'Owner (Sistem Yöneticisi)',
      email: 'admin@inopeak.com',
      password: 'admin123',
      description: 'Tüm sistemi yönetebilir, partner ekleyebilir, tag sözlüğünü düzenleyebilir'
    },
    {
      role: 'Partner Admin',
      email: 'manager@techpartner.com',
      password: 'manager123',
      description: 'Kendi organizasyonunun profillerini yönetebilir'
    },
    {
      role: 'Partner User',
      email: 'dev@techpartner.com',
      password: 'dev123',
      description: 'Sadece kendi profilini görüntüleyebilir'
    }
  ]

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="bg-blue-50 border-blue-200 shadow-large">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-900">Demo Hesapları</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-blue-700">
            Test etmek için bu hesapları kullanabilirsiniz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {demoAccounts.map((account, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 text-sm">{account.role}</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 w-12">E-posta:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">{account.email}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account.email, `email-${index}`)}
                    className="h-6 w-6 p-0"
                  >
                    {copied === `email-${index}` ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 w-12">Şifre:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">{account.password}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(account.password, `password-${index}`)}
                    className="h-6 w-6 p-0"
                  >
                    {copied === `password-${index}` ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mt-2">{account.description}</p>
            </div>
          ))}
          
          <div className="text-xs text-blue-600 bg-blue-100 rounded-lg p-2">
            💡 <strong>İpucu:</strong> Giriş yaptıktan sonra dashboard'da tüm özellikleri test edebilirsiniz!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
