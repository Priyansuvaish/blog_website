import React from 'react'
import { 
  MdCategory, MdArticle, MdScience, MdSportsSoccer, MdMusicNote, 
  MdMovie, MdPalette, MdFastfood, MdDirectionsCar, MdHome,
  MdWork, MdSchool, MdHealthAndSafety, MdPhoneAndroid, MdShoppingCart,
  MdFlight, MdCamera, MdGames, MdPets, MdEco 
} from 'react-icons/md'

interface CategoryIconProps {
  iconName: string
  className?: string
}

// Icon mapping for rendering
const iconMap: Record<string, React.ComponentType<any>> = {
  MdCategory,
  MdArticle,
  MdScience,
  MdSportsSoccer,
  MdMusicNote,
  MdMovie,
  MdPalette,
  MdFastfood,
  MdDirectionsCar,
  MdHome,
  MdWork,
  MdSchool,
  MdHealthAndSafety,
  MdPhoneAndroid,
  MdShoppingCart,
  MdFlight,
  MdCamera,
  MdGames,
  MdPets,
  MdEco
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ iconName, className = "" }) => {
  const IconComponent = iconMap[iconName] || iconMap.MdCategory
  
  return <IconComponent className={className} />
}

export default CategoryIcon 