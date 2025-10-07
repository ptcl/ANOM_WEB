// Optimisation des polices avec next/font pour éviter les warnings de préchargement
import localFont from 'next/font/local'

// Police IBM Plex Mono
export const ibmPlexMono = localFont({
  src: [
    {
      path: '../../public/fonts/ibm/IBMPlexMono-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-ExtraLightItalic.ttf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm/IBMPlexMono-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    }
  ],
  variable: '--font-ibm',
  display: 'swap',
  preload: true,
  fallback: ['Courier New', 'monospace']
})

// Police Neue Haas Display
export const neueHaasDisplay = localFont({
  src: [
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayThin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayXThin.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayLight.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayLightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayRoman.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayRomanItalic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayMedium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayMediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayBold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayBoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayBlack.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/grotesk/NeueHaasDisplayBlackItalic.ttf',
      weight: '900',
      style: 'italic',
    }
  ],
  variable: '--font-grotesk',
  display: 'swap',
  preload: true,
  fallback: ['Arial', 'sans-serif']
})

// Police Satoshi
export const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/satoshi/Satoshi-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/satoshi/Satoshi-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/satoshi/Satoshi-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/satoshi/Satoshi-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/satoshi/Satoshi-Black.ttf',
      weight: '900',
      style: 'normal',
    }
  ],
  variable: '--font-satoshi',
  display: 'swap',
  preload: false, // Chargement à la demande pour cette police
  fallback: ['Arial', 'sans-serif']
})