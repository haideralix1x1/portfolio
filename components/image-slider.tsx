"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface SliderImage {
  src: string
  alt: string
  title: string
}

interface ImageSliderProps {
  images: SliderImage[]
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000) // Change slide every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Image Display */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-white/5 backdrop-blur-md border border-white/20">
        <Image
          src={images[currentIndex].src || "/placeholder.svg"}
          alt={images[currentIndex].alt}
          fill
          className="object-cover transition-opacity duration-500"
        />

        {/* Image Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
          <h3 className="text-white text-xl font-semibold">{images[currentIndex].title}</h3>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
          onClick={nextSlide}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? "bg-purple-400" : "bg-white/30"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-2">
        <span className="text-white/60 text-sm">
          {currentIndex + 1} / {images.length}
        </span>
      </div>
    </div>
  )
}
