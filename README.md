<!-- FUTURISTIC FOOD SUSTAINABILITY HEADER -->

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00F5A0,50:00C9FF,100:FF6FD8&height=245&section=header&text=🥬%20KitchenInventory_AI%20🍽️&fontSize=38&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=SmartShelf%20%7C%20AI%20Meal%20Plans%20to%20Cut%20Food%20Waste%20🌍✨&descAlignY=60&descSize=18"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Food-Sustainability-2ECC71?style=for-the-badge&logo=leaflet&logoColor=white"/>
  <img src="https://img.shields.io/badge/Kitchen-Inventory-00C9FF?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/AI-Meal%20Planner-FF6FD8?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Zero%20Waste-Ready-8E44AD?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/AI%20Challenge-Vibe%20Coding-0CA678?style=for-the-badge"/>
</p>

---

# 🥬 KitchenInventory_AI 🍽️🌍  
### SmartShelf — AI Meal Plans That Save Groceries Before They Expire ⏳✨

Part of **AI App Challenge**  
Building one AI app per day using vibe-coding — solving one real-world industry problem at a time.

---

## 🌍 Industry
Food Sustainability / Smart Home / AI Meal Planning

---

## 🎯 Role & Objective
Design an engaging app (SmartShelf) that scans kitchen inventory and automatically suggests meal plans using an AI-powered sustainability index — helping reduce grocery waste.

---

## ✅ Conceptual Checklist (Before Building)
- Identify how inventory scans are captured (image + item extraction)
- Prioritize near-expiry items in recipe generation logic
- Define sustainability index scoring rules (waste, carbon, local usage)
- Design meal plan ranking system (highest sustainability score first)
- Add nutrition estimation per recipe for balanced planning
- Build strong error handling for missing/invalid expiry dates
- Validate usability + clarity for busy urban families after each iteration

---

## ⚠️ The Problem
Urban families often waste groceries because items expire before they’re used.

This happens due to:
- Busy schedules 🏙️
- Forgotten items in the fridge 🧊
- Lack of meal planning aligned to expiry dates ⏳
- Difficulty turning random leftovers into recipes 🍲

Food waste increases:
- Household costs 💸
- Landfill emissions 🌫️
- Environmental impact 🌍

---

## 💡 The Solution — SmartShelf
**KitchenInventory_AI** (SmartShelf) scans your kitchen inventory and generates meal plans that prioritize near-expiry groceries first.

The app:
- 📸 Scans groceries (or accepts structured inventory input)
- ⏳ Identifies what’s expiring soon
- 🍽️ Suggests recipes to use those items
- 📊 Calculates an AI sustainability index (0–100)
- 🥗 Adds nutrition details per recipe
- ✅ Ranks meal plans by sustainability score

---

## 🧠 Core Features
### 1️⃣ Inventory Scanner 📸
- Accepts kitchen inventory scans
- Extracts items: name, quantity, expiry date, image URL

### 2️⃣ Near-Expiry Priority Engine ⏳
- Automatically pushes soon-to-expire items into the top recipes
- Prevents food waste by design

### 3️⃣ AI Meal Plan Generator 🍽️
- Builds daily/weekly meal plans dynamically
- Creates recipes from what you already have

### 4️⃣ Sustainability Index Scoring 🌍
- Gives each meal a sustainability score (0–100)
- Explains how the score was calculated

### 5️⃣ Nutrition Layer 🥗
- Calories + macros for each recipe
- Helps users plan healthy meals, not just sustainable ones

### 6️⃣ Error Handling 🧾
- Excludes items with invalid expiry dates
- Logs issues clearly in an errors array

---

## 🧪 Core Prompt Used
> “Create an app that scans groceries and dynamically provides meal plans using an AI sustainability index.”

---

## 🛠 Tools Used  
- Gemini + Google AI Studio (ideation + scheduling logic design)  
- Google App Studio (core app development)  
- Google Stitch (UI design + prototyping)  
- Base44 (UI design + prototyping)  
- Figma (UI design + prototyping)  
- Google Opal (interaction testing + refinement)  
- React + TypeScript  
- Material Design principles  

---

## 📥 Input Requirements
Each scanned inventory item should include:

- `name` (string) — Item name  
- `quantity` (string) — Quantity with unit (e.g., `"2 kg"`)  
- `expiry_date` (string) — ISO date string (e.g., `"2026-03-10"`)  
- `image_url` (string, optional) — URL for item image  

---

## 📦 Output Format (JSON)
Your app must output valid JSON structured exactly like this:

```json
{
  "meal_plans": [
    {
      "plan_name": "string",
      "meals": [
        {
          "recipe_name": "string",
          "ingredients": [
            {
              "name": "string",
              "quantity": "string",
              "expiry_date": "string",
              "image_url": "string (optional)",
              "nutrition": {
                "calories": 0,
                "macros": { "protein": 0, "carbs": 0, "fat": 0 }
              }
            }
          ],
          "instructions": "string",
          "estimated_sustainability_index": {
            "score": 0,
            "method": "string"
          }
        }
      ],
      "overall_sustainability_score": 0
    }
  ],
  "errors": [
    {
      "item": "string",
      "issue": "string"
    }
  ]
}
