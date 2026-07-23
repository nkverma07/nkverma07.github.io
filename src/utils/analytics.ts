/**
 * Web Vitals & Analytics Tracking
 * Tracks Core Web Vitals and sends data to analytics services
 */

/**
 * Send event to analytics
 */
const sendAnalyticsEvent = (eventName: string, data: any) => {
  if (typeof window === 'undefined') return

  // Google Analytics
  if (typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('event', eventName, data)
  }

  // Fallback: Send to custom endpoint
  if (navigator.sendBeacon) {
    const payload = JSON.stringify({
      event: eventName,
      ...data,
      timestamp: new Date().toISOString(),
    })
    navigator.sendBeacon('/api/metrics', payload)
  }

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Analytics] ${eventName}:`, data)
  }
}

/**
 * Measure and report Core Web Vitals
 */
export const initializeWebVitals = () => {
  if (typeof window === 'undefined') return

  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        sendAnalyticsEvent('web_vitals', {
          metric_name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          metric_unit: 'millisecond',
          metric_category: 'performance',
        })
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('LCP Observer not supported', e)
    }

    // First Input Delay (FID) / Interaction to Next Paint (INP)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const delay = (entry as any).processingDuration
          sendAnalyticsEvent('web_vitals', {
            metric_name: 'INP',
            value: delay,
            metric_unit: 'millisecond',
            metric_category: 'performance',
          })
        }
      })
      fidObserver.observe({ entryTypes: ['first-input', 'interaction'] })
    } catch (e) {
      console.warn('INP Observer not supported', e)
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
            sendAnalyticsEvent('web_vitals', {
              metric_name: 'CLS',
              value: clsValue,
              metric_unit: 'fraction',
              metric_category: 'performance',
            })
          }
        }
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('CLS Observer not supported', e)
    }
  }

  // Page view event
  sendAnalyticsEvent('page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
  })
}

/**
 * Track custom events
 */
export const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  sendAnalyticsEvent(eventName, {
    ...eventData,
    user_agent: navigator.userAgent,
  })
}

/**
 * Track page navigation
 */
export const trackPageNavigation = (sectionName: string) => {
  trackEvent('portfolio_section_view', {
    section: sectionName,
    scroll_position: window.scrollY,
  })
}

/**
 * Track 3D feature usage
 */
export const track3DFeature = (featureName: string, action: string) => {
  trackEvent('3d_feature_interaction', {
    feature: featureName,
    action: action,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
  })
}

/**
 * Track time spent on page
 */
export const trackTimeOnPage = (sectionName: string, timeInSeconds: number) => {
  trackEvent('time_on_page', {
    section: sectionName,
    duration_seconds: timeInSeconds,
  })
}

/**
 * Performance monitoring
 */
export const reportPerformance = () => {
  if (typeof window === 'undefined' || !('performance' in window)) return

  const perfData = (window.performance as any).timing
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
  const connectTime = perfData.responseEnd - perfData.requestStart
  const renderTime = perfData.domComplete - perfData.domLoading
  const domContentLoadedTime = perfData.domContentLoadedEventEnd - perfData.navigationStart

  sendAnalyticsEvent('performance_metrics', {
    page_load_time: pageLoadTime,
    connect_time: connectTime,
    render_time: renderTime,
    dom_content_loaded_time: domContentLoadedTime,
  })
}

/**
 * Track device capabilities
 */
export const trackDeviceInfo = () => {
  const deviceMemory = (navigator as any).deviceMemory || 'unknown'
  const cores = navigator.hardwareConcurrency || 'unknown'
  const connection = (navigator as any).connection?.effectiveType || 'unknown'
  const platform = navigator.platform || 'unknown'
  const language = navigator.language || 'unknown'

  trackEvent('device_info', {
    device_memory_gb: deviceMemory,
    cpu_cores: cores,
    connection_type: connection,
    platform,
    language,
    screen_width: window.innerWidth,
    screen_height: window.innerHeight,
  })
}

/**
 * Initialize Google Analytics (if needed)
 */
export const initializeGoogleAnalytics = (measurementId: string) => {
  if (typeof window === 'undefined') return

  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // Initialize gtag
  ;(window as any).dataLayer = (window as any).dataLayer || []
  function gtag(..._args: any[]) {
    ;(window as any).dataLayer.push(arguments)
  }
  ;(window as any).gtag = gtag
  gtag('js', new Date())
  gtag('config', measurementId)
}
