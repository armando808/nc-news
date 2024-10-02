import { useState } from 'react'

export const useArticleView = (initialView = "popular") => {
    const [selectedView, setSelectedView] = useState(initialView)

    const handleViewChange = (view) => {
    setSelectedView(view)
    }

    return { selectedView, handleViewChange }
}