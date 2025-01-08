"use client"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, CalendarDays, ChefHat, CookingPot, Recycle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const menuItems = [
    { icon: Calendar, label: '一日献立提案', path: '/daily-menu'},
    { icon: CalendarDays, label: '３日分の献立提案', path: '/three-day-menu'},
    { icon: Recycle, label: 'リメイク料理提案', path: '/remake-recipes'},
    { icon: CookingPot, label: '今ある食材から提案', path: '/recipe'},
]

export function FanButton() {
  const [isOpen, setIsOpen] = useState(false)

  const radius = 140 // 扇の半径
  const angleStep = 30 // ボタン間の角度（度数法）
  const startAngle = 0 // 開始角度（度数法）

  const toggleMenu = () => {
    setIsOpen(prevState => !prevState)
  }

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <>
            {menuItems.map((item, index) => {
              const angle = (startAngle + index * angleStep) * (Math.PI / 180) // ラジアンに変換
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <motion.div
                  key={item.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    position: 'absolute',
                    bottom: `${y}px`,
                    right: `${x}px`,
                  }}
                >
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full shadow-lg bg-orange-100 hover:bg-orange-200 text-orange-600"
                    asChild
                  >
                    <Link to={item.path} onClick={() => setIsOpen(false)}>
                      <item.icon className="h-5 w-5" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </Button>
                </motion.div>
              )
            })}
          </>
        )}
      </AnimatePresence>
      <Button
        variant="default"
        size="icon"
        className="md:hidden rounded-full shadow-lg z-10 w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        onClick={toggleMenu}
      >
        <ChefHat className={`h-8 w-8 text-white transition-transform ${isOpen ? 'rotate-45' : ''}`} />
        <span className="sr-only">メニューを開く</span>
      </Button>
    </div>
  )
}

