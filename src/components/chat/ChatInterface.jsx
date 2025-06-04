'use client'

import { useState } from 'react'
import ChatSidebar from './ChatSidebar'
import ConversationView from './ConversationView'

const mockChats = [
  {
    id: 1,
    name: 'Jack Sanders',
    avatar: null,
    lastMessage: 'Good to hear. Make sure the CTA is consistent across all...',
    timestamp: '10 hours ago',
    isActive: true,
    unreadCount: 0
  },
  {
    id: 2,
    name: 'John Paul',
    avatar: null,
    lastMessage: 'selam',
    timestamp: '14 minutes ago',
    isActive: false,
    unreadCount: 2
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    avatar: null,
    lastMessage: 'The design looks great! When can we schedule...',
    timestamp: '2 hours ago',
    isActive: false,
    unreadCount: 0
  },
  {
    id: 4,
    name: 'Mike Davis',
    avatar: null,
    lastMessage: 'Perfect, let me know once the testing is complete',
    timestamp: '1 day ago',
    isActive: false,
    unreadCount: 1
  },
  {
    id: 5,
    name: 'Emily Chen',
    avatar: null,
    lastMessage: 'The quarterly report is ready for review',
    timestamp: '2 days ago',
    isActive: true,
    unreadCount: 3
  },
  {
    id: 6,
    name: 'David Wilson',
    avatar: null,
    lastMessage: 'Can we schedule a meeting for next week?',
    timestamp: '3 days ago',
    isActive: false,
    unreadCount: 0
  },
  {
    id: 7,
    name: 'Lisa Anderson',
    avatar: null,
    lastMessage: 'Thanks for the feedback on the project proposal',
    timestamp: '4 days ago',
    isActive: true,
    unreadCount: 1
  },
  {
    id: 8,
    name: 'Robert Brown',
    avatar: null,
    lastMessage: 'The client presentation went well yesterday',
    timestamp: '5 days ago',
    isActive: false,
    unreadCount: 0
  },
  {
    id: 9,
    name: 'Jennifer Taylor',
    avatar: null,
    lastMessage: 'Could you review the budget allocation?',
    timestamp: '1 week ago',
    isActive: false,
    unreadCount: 2
  },
  {
    id: 10,
    name: 'Kevin Martinez',
    avatar: null,
    lastMessage: 'The new employee onboarding process is complete',
    timestamp: '1 week ago',
    isActive: true,
    unreadCount: 0
  },
  {
    id: 11,
    name: 'Amanda White',
    avatar: null,
    lastMessage: 'HR policy updates have been sent to all departments',
    timestamp: '2 weeks ago',
    isActive: false,
    unreadCount: 0
  },
  {
    id: 12,
    name: 'Christopher Lee',
    avatar: null,
    lastMessage: 'Security audit results are available in the portal',
    timestamp: '2 weeks ago',
    isActive: false,
    unreadCount: 1
  },
  {
    id: 13,
    name: 'Michelle Garcia',
    avatar: null,
    lastMessage: 'Training session scheduled for Friday at 2 PM',
    timestamp: '3 weeks ago',
    isActive: true,
    unreadCount: 0
  },
  {
    id: 14,
    name: 'Daniel Rodriguez',
    avatar: null,
    lastMessage: 'System maintenance will be performed this weekend',
    timestamp: '3 weeks ago',
    isActive: false,
    unreadCount: 0
  },
  {
    id: 15,
    name: 'Rachel Thompson',
    avatar: null,
    lastMessage: 'Annual performance reviews are due next month',
    timestamp: '1 month ago',
    isActive: false,
    unreadCount: 2
  }
]

const mockMessages = {
  1: [
    {
      id: 1,
      senderId: 1,
      senderName: 'Jack Sanders',
      content: 'Hi Admin, just checking in to give you a quick update on the Q2 Lead Generation Campaign. We\'ve finalized the target audience personas.',
      timestamp: '10 hours ago',
      isCurrentUser: false
    },
    {
      id: 2,
      senderId: 'current',
      senderName: 'You',
      content: 'Great! Have you started building the email funnel yet?',
      timestamp: '10 hours ago',
      isCurrentUser: true
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'Jack Sanders',
      content: 'Yes, the content team has completed drafts for the email series. We\'re now reviewing them for tone and alignment with the Q2 messaging.',
      timestamp: '10 hours ago',
      isCurrentUser: false
    },
    {
      id: 4,
      senderId: 'current',
      senderName: 'You',
      content: 'Good to hear. Make sure the CTA is consistent across all emails. When are you planning to schedule the first round?',
      timestamp: '10 hours ago',
      isCurrentUser: true
    },
    {
      id: 5,
      senderId: 1,
      senderName: 'Jack Sanders',
      content: 'We\'re targeting next Monday for the first email. The landing pages are also being optimized for better conversion rates.',
      timestamp: '9 hours ago',
      isCurrentUser: false
    },
    {
      id: 6,
      senderId: 'current',
      senderName: 'You',
      content: 'Excellent! What about the A/B testing strategy for the subject lines?',
      timestamp: '9 hours ago',
      isCurrentUser: true
    },
    {
      id: 7,
      senderId: 1,
      senderName: 'Jack Sanders',
      content: 'We have 5 different subject line variations ready. We\'ll split test them across different segments to see which performs better.',
      timestamp: '9 hours ago',
      isCurrentUser: false
    },
    {
      id: 8,
      senderId: 'current',
      senderName: 'You',
      content: 'Perfect! Keep me posted on the results. Also, don\'t forget to track the engagement metrics closely.',
      timestamp: '8 hours ago',
      isCurrentUser: true
    },
    {
      id: 9,
      senderId: 1,
      senderName: 'Jack Sanders',
      content: 'Absolutely! I\'ll send you a detailed report by Friday with all the key metrics including open rates, click-through rates, and conversion data.',
      timestamp: '8 hours ago',
      isCurrentUser: false
    },
    {
      id: 10,
      senderId: 'current',
      senderName: 'You',
      content: 'Sounds great! Looking forward to seeing the results.',
      timestamp: '8 hours ago',
      isCurrentUser: true
    },
    {
      id: 11,
      senderId: 1,
      senderName: 'Jack Sanders',
      content: 'One more thing - should we also prepare backup content in case we need to pivot the messaging based on early results?',
      timestamp: '7 hours ago',
      isCurrentUser: false
    },
    {
      id: 12,
      senderId: 'current',
      senderName: 'You',
      content: 'That\'s a smart approach. Yes, please prepare 2-3 backup variations. It\'s always good to be prepared for quick adjustments.',
      timestamp: '7 hours ago',
      isCurrentUser: true
    },
    {
      id: 13,
      senderId: 1,
      senderName: 'Jack Sanders',
      content: 'Will do! I\'ll coordinate with the design team to ensure we have visual assets ready for the backup content as well.',
      timestamp: '6 hours ago',
      isCurrentUser: false
    },
    {
      id: 14,
      senderId: 'current',
      senderName: 'You',
      content: 'Excellent planning, Jack. This campaign is looking really solid. Let me know if you need any additional resources or support.',
      timestamp: '6 hours ago',
      isCurrentUser: true
    },
    {
      id: 15,
      senderId: 1,
      senderName: 'Jack Sanders',
      content: 'Thank you! I think we\'re well-prepared. I\'ll reach out if anything comes up. Excited to see how this performs!',
      timestamp: '5 hours ago',
      isCurrentUser: false
    }
  ],
  2: [
    {
      id: 1,
      senderId: 2,
      senderName: 'John Paul',
      content: 'selam',
      timestamp: '14 minutes ago',
      isCurrentUser: false
    },
    {
      id: 2,
      senderId: 'current',
      senderName: 'You',
      content: 'Hello John! How can I help you today?',
      timestamp: '12 minutes ago',
      isCurrentUser: true
    },
    {
      id: 3,
      senderId: 2,
      senderName: 'John Paul',
      content: 'I wanted to discuss the new project timeline',
      timestamp: '10 minutes ago',
      isCurrentUser: false
    },
    {
      id: 4,
      senderId: 'current',
      senderName: 'You',
      content: 'Sure, what specific aspects of the timeline would you like to review?',
      timestamp: '8 minutes ago',
      isCurrentUser: true
    },
    {
      id: 5,
      senderId: 2,
      senderName: 'John Paul',
      content: 'The development phase seems a bit tight. We might need an extra week for testing.',
      timestamp: '5 minutes ago',
      isCurrentUser: false
    }
  ],
  3: [
    {
      id: 1,
      senderId: 3,
      senderName: 'Sarah Johnson',
      content: 'The design looks great! When can we schedule the next review meeting?',
      timestamp: '2 hours ago',
      isCurrentUser: false
    },
    {
      id: 2,
      senderId: 'current',
      senderName: 'You',
      content: 'Thanks Sarah! How about Thursday afternoon?',
      timestamp: '2 hours ago',
      isCurrentUser: true
    },
    {
      id: 3,
      senderId: 3,
      senderName: 'Sarah Johnson',
      content: 'Thursday works perfectly. Should we invite the development team as well?',
      timestamp: '1 hour ago',
      isCurrentUser: false
    },
    {
      id: 4,
      senderId: 'current',
      senderName: 'You',
      content: 'Yes, that would be great. Let\'s include Mike and the frontend developers.',
      timestamp: '1 hour ago',
      isCurrentUser: true
    }
  ],
  5: [
    {
      id: 1,
      senderId: 5,
      senderName: 'Emily Chen',
      content: 'The quarterly report is ready for review',
      timestamp: '2 days ago',
      isCurrentUser: false
    },
    {
      id: 2,
      senderId: 'current',
      senderName: 'You',
      content: 'Perfect timing! I\'ll review it today and provide feedback.',
      timestamp: '2 days ago',
      isCurrentUser: true
    },
    {
      id: 3,
      senderId: 5,
      senderName: 'Emily Chen',
      content: 'Great! I\'ve highlighted the key performance indicators and areas that need attention.',
      timestamp: '2 days ago',
      isCurrentUser: false
    },
    {
      id: 4,
      senderId: 'current',
      senderName: 'You',
      content: 'Excellent work as always, Emily. Your attention to detail is much appreciated.',
      timestamp: '1 day ago',
      isCurrentUser: true
    },
    {
      id: 5,
      senderId: 5,
      senderName: 'Emily Chen',
      content: 'Thank you! Let me know if you need any additional data or clarification on any section.',
      timestamp: '1 day ago',
      isCurrentUser: false
    },
    {
      id: 6,
      senderId: 'current',
      senderName: 'You',
      content: 'Will do. I might have some questions about the revenue projections.',
      timestamp: '1 day ago',
      isCurrentUser: true
    }
  ]
}

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const currentMessages = mockMessages[selectedChat] || []

  return (
    <div className="flex h-full w-full bg-background">
      <ChatSidebar 
        chats={filteredChats}
        selectedChat={selectedChat}
        onSelectChat={setSelectedChat}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <ConversationView 
        chat={mockChats.find(chat => chat.id === selectedChat)}
        messages={currentMessages}
      />
    </div>
  )
} 