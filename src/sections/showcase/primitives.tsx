import type { CSSProperties, ReactNode } from 'react'

interface FaceProps {
  w: number
  h: number
  transform: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** Eine Fläche im 3D-Raum, um ihren Mittelpunkt zentriert. Rückseite ausgeblendet (Safari-sicher). */
export function Face({ w, h, transform, className = '', style, children }: FaceProps) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 ${className}`}
      style={{
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        transform,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export interface FaceSpec {
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

interface BoxProps {
  w: number
  h: number
  d: number
  front: FaceSpec
  back: FaceSpec
  left: FaceSpec
  right: FaceSpec
  top: FaceSpec
}

/** Quader aus 5 Flächen (ohne Unterseite). Das Elternelement muss preserve-3d sein. */
export function Box({ w, h, d, front, back, left, right, top }: BoxProps) {
  return (
    <>
      <Face w={w} h={h} transform={`translateZ(${d / 2}px)`} {...front} />
      <Face w={w} h={h} transform={`rotateY(180deg) translateZ(${d / 2}px)`} {...back} />
      <Face w={d} h={h} transform={`rotateY(90deg) translateZ(${w / 2}px)`} {...right} />
      <Face w={d} h={h} transform={`rotateY(-90deg) translateZ(${w / 2}px)`} {...left} />
      <Face w={w} h={d} transform={`rotateX(90deg) translateZ(${h / 2}px)`} {...top} />
    </>
  )
}
