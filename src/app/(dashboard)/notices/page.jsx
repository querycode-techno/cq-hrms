import NoticeBoard from '@/components/notices/NoticeBoard'

export default function NoticesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notice Board</h2>
          <p className="text-muted-foreground">
            Company announcements, news, and important updates
          </p>
        </div>
      </div>
      <NoticeBoard />
    </div>
  )
} 