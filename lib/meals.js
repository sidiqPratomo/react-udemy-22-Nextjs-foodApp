import fs from 'node:fs';
import sql from "better-sqlite3";
import slugify from "slugify";
import xss from 'xss';

const db = sql("meals.db");

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return db.prepare("SELECT * FROM meals").all();
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
  try {
    // Generate slug and sanitize instructions
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    // Determine file extension and file name
    const extension = meal.image.name.split('.').pop();
    const fileName = `${meal.slug}.${extension}`;

    // Convert the image to a buffer
    const imageBuffer = Buffer.from(await meal.image.arrayBuffer());

    // Save image to the file system using fs.promises.writeFile
    await fs.promises.writeFile(`public/images/${fileName}`, imageBuffer);

    // Update meal image path
    meal.image = `/images/${fileName}`;

    // Save meal to the database
    db.prepare(`
      INSERT INTO meals(title, summary, instructions, creator, creator_email, image, slug)
      VALUES(
        @title,
        @summary,
        @instructions,
        @creator,
        @creator_email,
        @image,
        @slug)
    `).run(meal);

  } catch (error) {
    throw new Error('Saving meal failed: ' + error.message);
  }
}
