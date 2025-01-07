import { useAuth } from '@/services/AuthContext'
import { Camera, ClipboardList, History, Home, List, PlusCircle, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export function MobileNav() {
  const { isAuthenticated } = useAuth()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900">
          <Home className="h-6 w-6" />
          <span className="text-xs">ホーム</span>
        </Link>
        <Link to="/food-list" className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900">
          <List className="h-6 w-6" />
          <span className="text-xs">食材一覧</span>
        </Link>
        <Link to="/camera" className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900">
          <Camera className="h-6 w-6" />
          <span className="text-xs">読み取り</span>
        </Link>
        <Link to="/multi-ingredient-form" className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900">
          <PlusCircle className="h-6 w-6" />
          <span className="text-xs">追加</span>
        </Link>
        <Link to="/Survey" className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900">
          <ClipboardList className="h-6 w-6" />
          <span className="text-xs">アンケート</span>
        </Link>
        <Link to="/history" className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900">
          <History className="h-6 w-6" />
          <span className="text-xs">履歴</span>
        </Link>
        <Link to={isAuthenticated ? "/logout" : "/auth"} className="flex flex-col items-center justify-center text-gray-600 hover:text-gray-900">
          <User className="h-6 w-6" />
          <span className="text-xs">{isAuthenticated ? "ログアウト" : "ログイン"}</span>
        </Link>
      </div>
    </nav>
  )
}

