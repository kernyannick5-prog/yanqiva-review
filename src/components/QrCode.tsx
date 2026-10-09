import QRCode from 'qrcode'
import { useEffect, useState } from 'react'

/** Rendert einen echten, scanbaren QR-Code als SVG. */
export function QrCode({ value, size = 200, className = '' }: { value: string; size?: number; className?: string }) {
  const [svg, setSvg] = useState('')

  useEffect(() => {
    let alive = true
    QRCode.toString(value, { type: 'svg', margin: 1, errorCorrectionLevel: 'M', color: { dark: '#07201a', light: '#ffffff' } })
      .then((s) => alive && setSvg(s))
      .catch(() => alive && setSvg(''))
    return () => {
      alive = false
    }
  }, [value])

  return (
    <div
      role="img"
      aria-label={`QR-Code für ${value}`}
      className={`overflow-hidden rounded-2xl bg-white p-2 [&_svg]:block [&_svg]:h-full [&_svg]:w-full ${className}`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
