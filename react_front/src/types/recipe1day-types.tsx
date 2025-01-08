// 個々の料理データを表すインターフェース
export interface Dish {
  id: number; // 料理ID
  name: string; // 料理名
  meal_type: string; // 料理のタイプ（主菜、副菜、汁物など）
  description: string; // 料理の説明
  ingredients: string[]; // 材料のリスト
  instructions: string[]; // 調理手順
  cooking_time: string; // 調理時間
}

// 食事全体のデータを表すインターフェース
export interface MealData {
  breakfast: Dish[]; // 朝食の料理
  lunch: Dish[];     // 昼食の料理
  dinner: Dish[];    // 夕食の料理
}
