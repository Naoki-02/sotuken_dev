// mealデータを変換する関数
import { Dish, MealData } from "../types/recipe1day-types";

export const fetchMealData = (mealArray: any[]): MealData => {
  const meal: MealData = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  // mealArrayからmeal_timeに基づいてカテゴリ分け
  mealArray.forEach((mealItem) => {
    const mealTime = mealItem.meal_time;  // breakfast, lunch, dinner

    mealItem.dishes.forEach((dish: any) => {
      const formattedDish: Dish = {
        id: dish.id,
        name: dish.name,
        description: dish.description,
        ingredients: dish.ingredients,
        instructions: dish.instructions,
        cooking_time: dish.cooking_time,
        meal_type: dish.meal_type, // 主菜、副菜、汁物
      };

      // meal_timeに基づいて配列に追加
      if (mealTime === "breakfast") {
        meal.breakfast.push(formattedDish);
      } else if (mealTime === "lunch") {
        meal.lunch.push(formattedDish);
      } else if (mealTime === "dinner") {
        meal.dinner.push(formattedDish);
      }
    });
  });

  return meal;
};
