import { useState } from 'react';
import { SmartShelfOutput, GroceryItem } from './types';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [inventory, setInventory] = useState<GroceryItem[]>([
    { name: 'Milk', quantity: '1 liter', expiry_date: '2026-03-01', image_url: 'https://picsum.photos/seed/milk/100/100' },
    { name: 'Eggs', quantity: '12 units', expiry_date: '2026-02-28', image_url: 'https://picsum.photos/seed/eggs/100/100' },
    { name: 'Bread', quantity: '1 loaf', expiry_date: '2026-02-27', image_url: 'https://picsum.photos/seed/bread/100/100' },
    { name: 'Tomatoes', quantity: '500g', expiry_date: '2026-03-05', image_url: 'https://picsum.photos/seed/tomatoes/100/100' },
    { name: 'Chicken Breast', quantity: '1 kg', expiry_date: '2026-02-26', image_url: 'https://picsum.photos/seed/chicken/100/100' },
  ]);
  const [output, setOutput] = useState<SmartShelfOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMealPlans = async () => {
    setLoading(true);
    setError(null);
    setOutput(null);

    const prompt = `Given the following kitchen inventory, generate meal plans that prioritize items closest to their expiry date. Each meal plan should include a name, a list of meals, and an overall sustainability score. Each meal should have a recipe name, an optional meal_image_url, a list of ingredients (including name, quantity, expiry_date, image_url, and nutrition with calories, protein, carbs, and fat macros), instructions, and an estimated sustainability index (score from 0-100 and method). The overall sustainability score for the meal plan should be a number. Exclude items with missing or invalid expiry dates and list them in the errors array with the issue specified. Ensure the output is valid JSON according to the SmartShelfOutput interface. For meal_image_url, use a relevant image from https://picsum.photos/seed/{keyword}/300/200, where {keyword} is related to the meal name.\n\nInventory: ${JSON.stringify(inventory)}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              meal_plans: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    plan_name: { type: 'STRING' },
                    meals: {
                      type: 'ARRAY',
                      items: {
                        type: 'OBJECT',
                        properties: {
                          recipe_name: { type: 'STRING' },
                          meal_image_url: { type: 'STRING' },
                          ingredients: {
                            type: 'ARRAY',
                            items: {
                              type: 'OBJECT',
                              properties: {
                                name: { type: 'STRING' },
                                quantity: { type: 'STRING' },
                                expiry_date: { type: 'STRING' },
                                image_url: { type: 'STRING' },
                                nutrition: {
                                  type: 'OBJECT',
                                  properties: {
                                    calories: { type: 'NUMBER' },
                                    macros: {
                                      type: 'OBJECT',
                                      properties: {
                                        protein: { type: 'NUMBER' },
                                        carbs: { type: 'NUMBER' },
                                        fat: { type: 'NUMBER' },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                          instructions: { type: 'STRING' },
                          estimated_sustainability_index: {
                            type: 'OBJECT',
                            properties: {
                              score: { type: 'NUMBER' },
                              method: { type: 'STRING' },
                            },
                          },
                        },
                      },
                    },
                    overall_sustainability_score: { type: 'NUMBER' },
                  },
                },
              },
              errors: {
                type: 'ARRAY',
                items: {
                  type: 'OBJECT',
                  properties: {
                    item: { type: 'STRING' },
                    issue: { type: 'STRING' },
                  },
                },
              },
            },
          },
        },
      });

      let rawText = response.text;
      if (rawText) {
        let parsedOutput: SmartShelfOutput | null = null;
        try {
          parsedOutput = JSON.parse(rawText);
        } catch (jsonError) {
          console.warn('Initial JSON parse failed, attempting to extract JSON:', jsonError);
          // Attempt to extract JSON if the response is malformed (e.g., wrapped in markdown or extra text)
          const jsonStartIndex = rawText.indexOf('{');
          const jsonEndIndex = rawText.lastIndexOf('}');
          if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
            const jsonString = rawText.substring(jsonStartIndex, jsonEndIndex + 1);
            try {
              parsedOutput = JSON.parse(jsonString);
            } catch (retryError) {
              console.error('Failed to parse extracted JSON:', retryError);
              setError('Failed to parse AI response. Please try again.');
            }
          } else {
            setError('AI response is not valid JSON and could not be extracted.');
          }
        }

        if (parsedOutput) {
          setOutput(parsedOutput);
        } else if (!error) {
          // Only set error if not already set by retryError
          setError('No valid meal plans could be parsed from the AI response.');
        }
      } else {
        setError('No response from AI model.');
      }
    } catch (err) {
      console.error('Error generating meal plans:', err);
      setError('Failed to generate meal plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">SmartShelf</h1>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Inventory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {inventory.map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg bg-gray-50">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-md" referrerPolicy="no-referrer" />
              )}
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                <p className="text-xs text-red-500">Expires: {item.expiry_date}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={generateMealPlans}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors duration-300 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Meal Plans'}
        </button>
      </div>

      {error && (
        <div className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {output && output.meal_plans.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Suggested Meal Plans</h2>
          {output.meal_plans.map((plan, planIndex) => (
            <div key={planIndex} className="mb-8 border-b pb-6 last:border-b-0 last:pb-0">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.plan_name}</h3>
              <p className="text-sm text-gray-600 mb-4">Overall Sustainability Score: <span className="font-semibold text-emerald-600">{plan.overall_sustainability_score.toFixed(1)}</span></p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {plan.meals.map((meal, mealIndex) => (
                  <div key={mealIndex} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    {meal.meal_image_url && (
                      <img src={meal.meal_image_url} alt={meal.recipe_name} className="w-full h-48 object-cover rounded-md mb-4" referrerPolicy="no-referrer" />
                    )}
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{meal.recipe_name}</h4>
                    <p className="text-sm text-gray-600 mb-2">Sustainability Score: {meal.estimated_sustainability_index.score.toFixed(1)} ({meal.estimated_sustainability_index.method})</p>
                    <p className="font-medium text-gray-700 mb-1">Ingredients:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 mb-3">
                      {meal.ingredients.map((ingredient, ingIndex) => (
                        <li key={ingIndex} className="flex items-center space-x-2">
                          {ingredient.image_url && (
                            <img src={ingredient.image_url} alt={ingredient.name} className="w-8 h-8 object-cover rounded-full" referrerPolicy="no-referrer" />
                          )}
                          <span>{ingredient.name} ({ingredient.quantity}) - Expires: {ingredient.expiry_date}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="font-medium text-gray-700 mb-1">Nutrition:</p>
                    <p className="text-sm text-gray-600 mb-3">
                      Calories: {meal.ingredients.reduce((acc, ing) => acc + ing.nutrition.calories, 0).toFixed(0)} kcal | 
                      Protein: {meal.ingredients.reduce((acc, ing) => acc + ing.nutrition.macros.protein, 0).toFixed(0)}g | 
                      Carbs: {meal.ingredients.reduce((acc, ing) => acc + ing.nutrition.macros.carbs, 0).toFixed(0)}g | 
                      Fat: {meal.ingredients.reduce((acc, ing) => acc + ing.nutrition.macros.fat, 0).toFixed(0)}g
                    </p>
                    <p className="font-medium text-gray-700 mb-1">Instructions:</p>
                    <p className="text-sm text-gray-600">{meal.instructions}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {output && output.errors.length > 0 && (
        <div className="max-w-4xl mx-auto bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mt-8" role="alert">
          <strong className="font-bold">Issues Found:</strong>
          <ul className="mt-2 list-disc list-inside">
            {output.errors.map((err, index) => (
              <li key={index}>{err.item}: {err.issue}</li>
            ))}
          </ul>
        </div>
      )}

      {output && output.meal_plans.length === 0 && output.errors.length === 0 && !loading && (
        <div className="max-w-4xl mx-auto bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mt-8" role="alert">
          <strong className="font-bold">No Meal Plans Generated</strong>
          <span className="block sm:inline"> The AI did not generate any meal plans based on your inventory.</span>
        </div>
      )}
    </div>
  );
}
