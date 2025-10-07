'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useWindowsStore } from '@/store/useWindowsStore'
import { useDrag } from '../provider/DragProvider'

interface DesktopIconProps {
  name?: string
  icon: string
  pinned?: boolean
  onClick?: () => void
  onDoubleClick: () => void
  id?: string
  position?: { x: number, y: number }
  selected?: boolean
  onSelectionChange?: (selected: boolean) => void
  onRegister?: (id: string, element: HTMLElement, position: { x: number, y: number }, size: { width: number, height: number }) => void
  onUnregister?: (id: string) => void
}

export default function DesktopIcon({ id, name, icon, onClick, onDoubleClick, pinned = false, position, selected = false, onSelectionChange, }: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(selected)
  const [iconPosition, setIconPosition] = useState(position || { x: 0, y: 0 })

  const iconRef = useRef<HTMLDivElement>(null)
  const { addPinnedApp, removePinnedApp, updateIconPosition } = useWindowsStore()
  const { isDragging, currentDragId, startDrag } = useDrag()
  const isThisIconDragging = isDragging && currentDragId === id
  useEffect(() => {
    if (position) {
      setIconPosition(position)
    }
  }, [position])

  useEffect(() => {
    if (selected !== isSelected) {
      setIsSelected(selected)
    }
  }, [selected, isSelected])

  const isInternalChange = useRef(false)

  const updateSelectionInternally = (newSelection: boolean) => {
    isInternalChange.current = true
    setIsSelected(newSelection)
  }

  useEffect(() => {
    if (onSelectionChange && isInternalChange.current) {
      onSelectionChange(isSelected)
      isInternalChange.current = false
    }
  }, [isSelected, onSelectionChange])

  const handleClick = (e: React.MouseEvent) => {
    if (!e.ctrlKey) {
      updateSelectionInternally(true)
    } else {
      updateSelectionInternally(!isSelected)
    }

    onClick?.()
  }

  const handleDoubleClick = () => {
    onDoubleClick()
  }

  const handleBlur = () => {
    updateSelectionInternally(false)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button === 2) return;

    if (!id) return;

    startDrag(
      e,
      id,
      iconPosition,
      (newPosition) => {
        setIconPosition(newPosition);
      },
      (finalPosition) => {
        updateIconPosition(id, finalPosition);
      },
      {
        minX: 0,
        minY: 0
      }
    );
  }

  const togglePin = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (id) {
      if (pinned) {
        removePinnedApp(id)
      } else {
        addPinnedApp({
          id,
          name: name ?? "",
          icon
        })
      }
      setTimeout(() => {
        // Variables supprimées car non utilisées pour le debug
        // console.log(`DesktopIcon: After toggle, ${id} isPinned`)
        // console.log(`DesktopIcon: Current pinned apps`)
      }, 0)
    }
  }

  return (
    <div ref={iconRef} className={cn("flex flex-col items-center justify-center rounded select-none py-2 w-fit hover:bg-white/10 w-30 cursor-pointer absolute", isSelected ? "bg-white/10" : "", isThisIconDragging ? "opacity-70" : "")} style={{ transform: `translate(${iconPosition.x}px, ${iconPosition.y}px)`, touchAction: "none" }} onClick={handleClick} onDoubleClick={handleDoubleClick} onBlur={handleBlur} onContextMenu={togglePin} onPointerDown={handlePointerDown} tabIndex={0}>
      <Image src={icon} alt={name ?? ""} width={40} height={40} className="pointer-events-none" />
      <p className="text-center text-sm text-white drop-shadow-md">
        {name}
      </p>
    </div>
  )
}