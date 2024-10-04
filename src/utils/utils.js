import { useLocation } from 'react-router-dom'

export function useQuery() {
    return new URLSearchParams(useLocation().search)
}

export const formatTitle = (title) => {
    return title
        .split(' ')
        .map((word) => {
            if (word === 'APIs') return word
            if (word.toLowerCase() === 'fc') return 'FC'
            if (word.length > 1 && word.toUpperCase() === word) {
                return word.charAt(0) + word.slice(1).toLowerCase()
            }
            return capitalize(word)
        })
        .join(' ')
}

export const formatPageTitle = (selectedOption) => {
    if (selectedOption === 'newest') return 'Newest Articles'
    if (selectedOption === 'oldest') return 'Oldest Articles'
    if (selectedOption === 'most_popular') return 'Most Popular Articles'
    if (selectedOption === 'least_popular') return 'Least Popular Articles'
    if (selectedOption.startsWith('topic_')) {
        const [_, topic] = selectedOption.split('_')
        return `${formatTitle(topic)} Articles`
    }
    return 'All Articles'
}

export const capitalizeTitle = (title) => {
    if (!title || typeof title !== 'string') {
        return ''
    }
    return title
        .split(' ')
        .map((word) => {
            if (word === 'APIs') return word
            if (word.toLowerCase() === 'fc') return 'FC'
            if (word.length > 1 && word.toUpperCase() === word) {
                return word.charAt(0) + word.slice(1).toLowerCase()
            }
            return capitalize(word)
        })
        .join(' ')
}

export const capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export const truncateTitle = (title, maxLength) => {
    return title.length > maxLength ? title.slice(0, maxLength - 3) + '...' : title
}
