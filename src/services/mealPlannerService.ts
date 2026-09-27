import { Biomarker } from '../types/report.ts';
import { DayMealPlan, GroceryItem } from '../types/user.ts';

export function generate7DayMealPlan(biomarkers: Biomarker[]): {
  weekSchedule: DayMealPlan[];
  groceryList: GroceryItem[];
} {
  const isVitDLow = biomarkers.some((b) => b.id.includes('vit-d') && (b.numericValue || 0) < 30);
  const isLdlHigh = biomarkers.some((b) => b.id.includes('ldl') && (b.numericValue || 0) > 100);
  const isAnemic = biomarkers.some((b) => (b.id.includes('hb') || b.id.includes('hemoglobin')) && (b.numericValue || 0) < 12);

  const weekSchedule: DayMealPlan[] = [
    {
      dayNumber: 1,
      dayName: 'Monday (Heart & Energy Kickoff)',
      meals: [
        {
          meal: 'Breakfast',
          title: 'Steel-Cut Oatmeal with Blueberries & Walnuts',
          description: '1 cup warm rolled oats cooked in fortified milk/water, topped with 1 tbsp ground flaxseeds, fresh blueberries, and 6 crushed walnuts.',
          keyNutrients: ['Beta-Glucan Soluble Fiber', 'Omega-3 ALA', 'Vitamin D']
        },
        {
          meal: 'Lunch',
          title: 'Mediterranean Quinoa & Chickpea Bowl',
          description: 'Boiled chickpeas, steamed quinoa, cucumber, cherry tomatoes, baby spinach, and 1 tbsp extra virgin olive oil and lemon juice dressing.',
          keyNutrients: ['Plant Protein', 'Soluble Fiber', 'Monounsaturated Fats']
        },
        {
          meal: 'Snack',
          title: 'Green Tea & Roasted Pumpkin Seeds',
          description: '1 cup brewed green tea (EGCG rich) with a handful of raw pumpkin seeds and 1 sliced apple.',
          keyNutrients: ['Antioxidants', 'Pectin Fiber', 'Zinc']
        },
        {
          meal: 'Dinner',
          title: 'Steamed Lentil Dal with Garlic Sautéed Spinach',
          description: 'Warm yellow moong dal with cumin and turmeric, paired with steamed spinach (with lemon squeeze) and 1 whole-wheat roti.',
          keyNutrients: ['Iron Pairing (Vit C + Spinach)', 'Lean Protein']
        }
      ],
      dailyHealthTip: 'Soluble fiber from oats and chickpeas binds directly to cholesterol in your digestive system, assisting liver clearance.'
    },
    {
      dayNumber: 2,
      dayName: 'Tuesday (Vitamin D & Bone Density)',
      meals: [
        {
          meal: 'Breakfast',
          title: 'Avocado & Boiled Egg on Sourdough Toast',
          description: '2 pasture-raised boiled eggs (Vitamin D in yolks) with sliced ripe avocado and crushed black pepper on artisanal sourdough.',
          keyNutrients: ['Dietary Cholecalciferol', 'Healthy Lipids', 'Choline']
        },
        {
          meal: 'Lunch',
          title: 'Grilled Salmon / Paneer with Roasted Broccoli & Brown Rice',
          description: 'Wild salmon fillet (or grilled low-fat paneer) paired with garlic-roasted broccoli florets and 1/2 cup brown rice.',
          keyNutrients: ['EPA & DHA Omega-3', 'Vitamin D3', 'Sulforaphane']
        },
        {
          meal: 'Snack',
          title: 'Probiotic Greek Yogurt with Chia Seeds',
          description: '1/2 cup plain unsweetened yogurt topped with 1 tsp soaked chia seeds and a pinch of cinnamon.',
          keyNutrients: ['Gut Microbiome', 'Calcium', 'Soluble Mucilage']
        },
        {
          meal: 'Dinner',
          title: 'Hearty Minestrone Vegetable & Bean Soup',
          description: 'Rich tomato broth filled with kidney beans, zucchini, carrots, celery, and fresh basil.',
          keyNutrients: ['Lycopene', 'Dietary Fiber', 'Potassium']
        }
      ],
      dailyHealthTip: 'Always consume Vitamin D supplements alongside healthy fats (such as avocado, eggs, or nuts) to maximize intestinal absorption.'
    },
    {
      dayNumber: 3,
      dayName: 'Wednesday (Antioxidant & Vascular Flow)',
      meals: [
        {
          meal: 'Breakfast',
          title: 'Chia Seed & Almond Milk Pudding',
          description: 'Overnight chia pudding made with fortified almond milk, layered with sliced strawberries and kiwi.',
          keyNutrients: ['Vitamin C', 'Soluble Fiber', 'Calcium']
        },
        {
          meal: 'Lunch',
          title: 'Warm Sprouted Moong Bean & Pomegranate Salad',
          description: 'Steamed sprouted mung beans tossed with fresh pomegranate pearls, chopped coriander, and lime juice.',
          keyNutrients: ['Bioavailable Iron', 'Polyphenols', 'Enzymes']
        },
        {
          meal: 'Snack',
          title: 'Handful of Raw Almonds & Walnuts (30g)',
          description: 'Unsalted raw almonds and walnuts paired with chamomile or hibiscus tea.',
          keyNutrients: ['Vitamin E', 'Arginine', 'Nitric Oxide Support']
        },
        {
          meal: 'Dinner',
          title: 'Baked Herb-Crusted Tofu / Chicken with Asparagus',
          description: 'Rosemary-marinated tofu or chicken breast with steamed asparagus spears and sweet potato mash.',
          keyNutrients: ['Complex Carbohydrates', 'Lean Protein', 'Prebiotics']
        }
      ],
      dailyHealthTip: 'Pomegranate and green tea contain polyphenols that protect circulating LDL particles from oxidative stress.'
    },
    {
      dayNumber: 4,
      dayName: 'Thursday (Cellular Iron & Oxygenation)',
      meals: [
        {
          meal: 'Breakfast',
          title: 'Warm Vegetable Poha / Upma with Roasted Peanuts',
          description: 'Flattened rice cooked with mustard seeds, green peas, carrots, curry leaves, and a lemon wedge squeeze.',
          keyNutrients: ['Non-heme Iron', 'B-Vitamins', 'Vitamin C']
        },
        {
          meal: 'Lunch',
          title: 'Lentil & Mixed Greens Buddha Bowl',
          description: 'Cooked brown lentils, massaged kale, roasted beets, and tahini-garlic dressing.',
          keyNutrients: ['Nitrates for Blood Flow', 'Iron', 'Sesame Lignans']
        },
        {
          meal: 'Snack',
          title: 'Black Soaked Raisins & Dry Roasted Makhana (Foxnuts)',
          description: '10 overnight soaked black raisins and 1 bowl lightly roasted makhana.',
          keyNutrients: ['Bioavailable Iron', 'Magnesium', 'Low Glycemic Energy']
        },
        {
          meal: 'Dinner',
          title: 'Stir-Fried UV-Exposed Mushrooms & Bell Peppers with Quinoa',
          description: 'Button mushrooms (rich in natural Vitamin D2) stir-fried with colorful bell peppers in 1 tsp olive oil.',
          keyNutrients: ['Mycosterol Vit D', 'Vitamin C', 'Flavonoids']
        }
      ],
      dailyHealthTip: 'Pairing iron-rich foods with Vitamin C (like lemon on lentils) doubles non-heme iron absorption.'
    },
    {
      dayNumber: 5,
      dayName: 'Friday (Lipid Clearance & Endothelial Care)',
      meals: [
        {
          meal: 'Breakfast',
          title: 'Berry & Flaxseed Smoothie Bowl',
          description: 'Blended frozen berries, fortified soy/dairy milk, 1 tbsp ground flaxseeds, and a scoop of plant protein.',
          keyNutrients: ['Anthocyanins', 'Phytoestrogens', 'Soluble Fiber']
        },
        {
          meal: 'Lunch',
          title: 'Whole-Wheat Wrap with Hummus & Roasted Vegetables',
          description: 'Whole grain tortilla spread with garlic hummus, stuffed with roasted zucchini, bell peppers, and arugula.',
          keyNutrients: ['Complex Fiber', 'Plant Sterols', 'Folate']
        },
        {
          meal: 'Snack',
          title: 'Carrot & Cucumber Sticks with Guacamole',
          description: 'Crunchy raw vegetable batons dipped in fresh crushed avocado dip.',
          keyNutrients: ['Beta-Carotene', 'Healthy Monounsaturated Fats']
        },
        {
          meal: 'Dinner',
          title: 'Baked Fish / Grilled Paneer with Steamed Green Beans',
          description: 'Seasoned fish or paneer baked with lemon dill herbs, served alongside almond-topped steamed french beans.',
          keyNutrients: ['Omega-3 Fatty Acids', 'Magnesium', 'Protein']
        }
      ],
      dailyHealthTip: 'Aim for at least 30g of total dietary fiber per day to support optimal hepatic LDL receptor activity.'
    },
    {
      dayNumber: 6,
      dayName: 'Saturday (Restorative & Liver Cleansing)',
      meals: [
        {
          meal: 'Breakfast',
          title: 'Buckwheat / Ragi Dosa with Tomato Chutney',
          description: 'Fermented ragi (finger millet) crêpe served with fresh antioxidant tomato and mint chutney.',
          keyNutrients: ['Calcium', 'Fermented Probiotics', 'Low GI']
        },
        {
          meal: 'Lunch',
          title: 'Large Mediterranean Greek Salad with Olive Oil & Tofu Feta',
          description: 'Crisp romaine, Kalamata olives, diced cucumbers, red onions, and cold-pressed extra virgin olive oil.',
          keyNutrients: ['Oleic Acid', 'Polyphenols', 'Electrolytes']
        },
        {
          meal: 'Snack',
          title: '1 Papaya or Guava Bowl with Chaat Masala',
          description: 'Fresh sliced ripe papaya or pink guava.',
          keyNutrients: ['Digestive Papain', 'Vitamin C', 'Lycopene']
        },
        {
          meal: 'Dinner',
          title: 'Warm Vegetable Khichdi with Flaxseed Tadka',
          description: 'Comforting rice and moong dal khichdi cooked with cumin, ginger, and turmeric, topped with crushed flaxseeds.',
          keyNutrients: ['Easy Digestion', 'Curcumin Anti-inflammatory', 'Fiber']
        }
      ],
      dailyHealthTip: 'Turmeric (Curcumin) combined with black pepper promotes liver bile flow and cellular antioxidant enzymes.'
    },
    {
      dayNumber: 7,
      dayName: 'Sunday (Weekly Reset & Sunshine Meal)',
      meals: [
        {
          meal: 'Breakfast',
          title: 'Sunday Scramble with Spinach, Mushrooms & Toast',
          description: '2 eggs or crumbled tofu scrambled with button mushrooms and fresh baby spinach, served on rye toast.',
          keyNutrients: ['Vitamin D', 'Lutein', 'Protein']
        },
        {
          meal: 'Lunch',
          title: 'Slow-Cooked Lentil Soup with Roasted Beet & Walnut Salad',
          description: 'Thick brown lentil stew with side salad of roasted beetroot, crumbled goat cheese / paneer, and toasted walnuts.',
          keyNutrients: ['Folate', 'Arginine', 'Nitric Oxide']
        },
        {
          meal: 'Snack',
          title: 'Roasted Chickpeas (Chana) with 1 Fresh Orange',
          description: 'Crunchy spiced roasted chickpeas paired with fresh whole orange segments.',
          keyNutrients: ['Vitamin C', 'Resistant Starch', 'Satiety']
        },
        {
          meal: 'Dinner',
          title: 'Steamed Broccoli, Cauliflower & Edamame Sauté with Brown Rice',
          description: 'Cruciferous vegetable medley tossed in sesame oil and low-sodium tamari, over steamed brown rice.',
          keyNutrients: ['Glucosinolates', 'Plant Protein', 'Prebiotic Inulin']
        }
      ],
      dailyHealthTip: 'Enjoy 15-20 minutes of outdoor morning sunshine today to stimulate natural cutaneous cholecalciferol synthesis.'
    }
  ];

  const groceryList: GroceryItem[] = [
    // Produce
    { id: 'g1', category: 'Fresh Produce', name: 'Baby Spinach & Kale', quantity: '2 bunches', purpose: 'Iron & Folate support', checked: false },
    { id: 'g2', category: 'Fresh Produce', name: 'Fresh Button Mushrooms', quantity: '250g', purpose: 'Dietary Vitamin D', checked: false },
    { id: 'g3', category: 'Fresh Produce', name: 'Blueberries & Strawberries', quantity: '200g', purpose: 'Soluble fiber & Antioxidants', checked: false },
    { id: 'g4', category: 'Fresh Produce', name: 'Lemons & Limes', quantity: '6 pcs', purpose: 'Vitamin C for iron absorption', checked: false },
    { id: 'g5', category: 'Fresh Produce', name: 'Avocados', quantity: '2-3 pcs', purpose: 'Monounsaturated healthy fats', checked: false },
    { id: 'g6', category: 'Fresh Produce', name: 'Broccoli & Cauliflower', quantity: '1 head each', purpose: 'Cruciferous liver support', checked: false },
    { id: 'g7', category: 'Fresh Produce', name: 'Beetroot & Pomegranate', quantity: '500g', purpose: 'Nitric oxide and endothelial flow', checked: false },

    // Whole Grains & Legumes
    { id: 'g8', category: 'Whole Grains & Legumes', name: 'Rolled Oats / Steel Cut Oats', quantity: '1 kg', purpose: 'Beta-glucan LDL reduction', checked: false },
    { id: 'g9', category: 'Whole Grains & Legumes', name: 'Chickpeas & Kidney Beans', quantity: '500g each', purpose: 'Soluble fiber & plant protein', checked: false },
    { id: 'g10', category: 'Whole Grains & Legumes', name: 'Yellow Moong Dal & Brown Lentils', quantity: '1 kg', purpose: 'Clean digestible protein', checked: false },
    { id: 'g11', category: 'Whole Grains & Legumes', name: 'Quinoa / Brown Rice', quantity: '500g', purpose: 'Low glycemic complex energy', checked: false },

    // Healthy Fats & Nuts
    { id: 'g12', category: 'Nuts, Seeds & Oils', name: 'Raw Walnuts & Almonds', quantity: '250g each', purpose: 'Omega-3 ALA and Vitamin E', checked: false },
    { id: 'g13', category: 'Nuts, Seeds & Oils', name: 'Chia Seeds & Ground Flaxseeds', quantity: '200g each', purpose: 'Mucilage fiber and heart lipids', checked: false },
    { id: 'g14', category: 'Nuts, Seeds & Oils', name: 'Extra Virgin Olive Oil (Cold-Pressed)', quantity: '500 ml', purpose: 'Cardiovascular cooking oil', checked: false },

    // Dairy & Fortified
    { id: 'g15', category: 'Dairy & Fortified Foods', name: 'Fortified Milk / Soy Milk', quantity: '2 Liters', purpose: 'Vitamin D3 & Calcium fortification', checked: false },
    { id: 'g16', category: 'Dairy & Fortified Foods', name: 'Pasture-Raised Eggs', quantity: '1 dozen', purpose: 'Natural yolk Vitamin D3', checked: false },
    { id: 'g17', category: 'Dairy & Fortified Foods', name: 'Plain Greek Yogurt / Curd', quantity: '500g', purpose: 'Probiotics & protein', checked: false }
  ];

  return {
    weekSchedule,
    groceryList
  };
}