// src/components/MapSection.tsx
"use client"

import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

const DynamicMap = dynamic(() => import("./MapClient"), {
  ssr: false,
})

export default function MapSection() {
  return (
    <div className="w-full mt-10 mb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center text-green-700">
          Peta Nagari Sungai Nanam
        </h2>
        <div className="w-full h-[400px] rounded-md overflow-hidden shadow-md">
          <DynamicMap />
        </div>
      </div>
    </div>
  )
}
