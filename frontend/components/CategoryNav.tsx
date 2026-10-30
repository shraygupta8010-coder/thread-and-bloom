'use client';

interface CategoryNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'all', name: 'All Collection' },
  { id: 'Bedsheets', name: 'Bedsheets & Sheets' },
  { id: 'Comforters', name: 'Comforters & Duvets' },
  { id: 'Towels', name: 'Bath & Towels' },
  { id: 'Blankets', name: 'Throws & Blankets' },
  { id: 'deals', name: '✦ Archive Sale' },
];

export default function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <nav className="bg-[#FCFBF9] border-b border-[#E7E5E0] sticky top-20 z-40">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide py-1">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const isDeals = cat.id === 'deals';

            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`
                  relative px-4 py-2.5 text-xs sm:text-[13px] font-medium tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer rounded-md
                  ${
                    isActive
                      ? 'text-[#2D4A3E] font-semibold bg-[#2D4A3E]/8'
                      : isDeals
                      ? 'text-[#9A6038] hover:text-[#7A4B29] hover:bg-[#9A6038]/8 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }
                `}
              >
                {cat.name}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#2D4A3E] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
