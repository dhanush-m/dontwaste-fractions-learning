'use client'

import { useState, useEffect } from 'react'
import LandingPage from '@/components/LandingPage'
import Introduction from '@/components/Introduction'
import ProfileSetup from '@/components/ProfileSetup'
import PreAssessment from '@/components/PreAssessment'
import ChapterNavigator from '@/components/ChapterNavigator'
import ChapterFlow from '@/components/ChapterFlow'
import Assessment from '@/components/Assessment'
import Dashboard from '@/components/Dashboard'
import GamesMenu from '@/components/GamesMenu'
import WasteMeter from '@/components/WasteMeter'
import EnhancedFocusMeter from '@/components/EnhancedFocusMeter'
import { useEnhancedStore } from '@/store/enhancedAppStore'

// 🎯 Toggle between meters: 'original' or 'enhanced'
// Change this to easily test both versions!
const USE_METER = 'enhanced' // Try: 'original' or 'enhanced'

export default function Home() {
  const { currentPhase, sessionId, initializeSession, setPhase, currentChapter, setCurrentChapter } = useEnhancedStore()

  useEffect(() => {
    // Initialize session on mount
    if (!sessionId) {
      initializeSession()
    }
  }, [sessionId, initializeSession])

  const renderPhase = () => {
    switch (currentPhase) {
      case 'landing':
        return <LandingPage />
      case 'introduction':
        return <Introduction />
      case 'profile':
        return <ProfileSetup onComplete={() => setPhase('pre-assessment')} />
      case 'pre-assessment':
        return <PreAssessment onComplete={() => setPhase('chapters')} />
      case 'chapters':
        return <ChapterNavigator onSelectChapter={(chapterId) => {
          setCurrentChapter(chapterId)
          setPhase('chapter-flow')
        }} />
      case 'chapter-flow':
        return <ChapterFlow
          chapterId={currentChapter}
          onComplete={() => setPhase('chapters')}
        />
      case 'games':
        return <GamesMenu onBack={() => setPhase('chapters')} />
      case 'assessment':
        return <Assessment />
      case 'dashboard':
        return <Dashboard />
      default:
        return <LandingPage />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {renderPhase()}
      {/* Show focus meter on all pages except landing and dashboard */}
      {currentPhase !== 'landing' && currentPhase !== 'dashboard' && (
        USE_METER === 'enhanced' ? <EnhancedFocusMeter /> : <WasteMeter />
      )}
    </main>
  )
}

