/**
 * Helper utilities for recipe scaling, badge colors, and ingredient parsing.
 */

// Format numbers as fractions or clean decimals
const formatQuantity = (num) => {
  if (Math.abs(num - 0.25) < 0.01) return '1/4';
  if (Math.abs(num - 0.33) < 0.02) return '1/3';
  if (Math.abs(num - 0.5) < 0.01) return '1/2';
  if (Math.abs(num - 0.75) < 0.01) return '3/4';
  if (Math.abs(num - 1.5) < 0.01) return '1 1/2';
  if (Math.abs(num - 2.5) < 0.01) return '2 1/2';
  
  if (Number.isInteger(num)) return num.toString();
  return num % 1 === 0 ? num.toString() : num.toFixed(1).replace(/\.0$/, '');
};

// Scale ingredient based on servings ratio
export const scaleIngredient = (text, baseServings = 4, targetServings = 4) => {
  if (!text || baseServings === targetServings || baseServings <= 0) return text;
  
  const ratio = targetServings / baseServings;

  // Regex to match fraction (e.g. 1/2), mixed (1 1/2), or decimal/integer at the beginning
  const fractionMatch = text.match(/^(\d+)\/(\d+)\s*(.*)$/);
  if (fractionMatch) {
    const num = (parseInt(fractionMatch[1], 10) / parseInt(fractionMatch[2], 10)) * ratio;
    return `${formatQuantity(num)} ${fractionMatch[3]}`;
  }

  const mixedMatch = text.match(/^(\d+)\s+(\d+)\/(\d+)\s*(.*)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1], 10);
    const frac = parseInt(mixedMatch[2], 10) / parseInt(mixedMatch[3], 10);
    const num = (whole + frac) * ratio;
    return `${formatQuantity(num)} ${mixedMatch[4]}`;
  }

  const numberMatch = text.match(/^([\d.,]+)\s*(.*)$/);
  if (numberMatch) {
    const parsed = parseFloat(numberMatch[1].replace(',', '.'));
    if (!isNaN(parsed)) {
      const scaled = parsed * ratio;
      return `${formatQuantity(scaled)} ${numberMatch[2]}`;
    }
  }

  return text;
};

// Parse minutes from time string (e.g. "30 menit" -> 30)
export const parseTimeInMinutes = (timeStr) => {
  if (!timeStr) return 30;
  const match = timeStr.toString().match(/\d+/);
  return match ? parseInt(match[0], 10) : 30;
};

// Visual badge styles for categories
export const getCategoryBadge = (category) => {
  switch (category) {
    case 'Makanan Utama':
      return {
        bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
        icon: '🍛',
      };
    case 'Makanan Pembuka':
      return {
        bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
        icon: '🥟',
      };
    case 'Makanan Penutup':
      return {
        bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
        icon: '🍰',
      };
    case 'Minuman':
      return {
        bg: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800/50',
        icon: '🍹',
      };
    case 'Camilan':
      return {
        bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/50',
        icon: '🥨',
      };
    default:
      return {
        bg: 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700',
        icon: '🍽️',
      };
  }
};

// Visual badge styles for difficulty
export const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case 'Mudah':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40';
    case 'Sedang':
      return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/40';
    case 'Mahir':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/40';
    default:
      return 'bg-stone-50 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border-stone-200 dark:border-stone-700';
  }
};
