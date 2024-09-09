'use server'

import { redirect } from "next/navigation";
import { saveMeal } from "./meals"

export async function shareMeal(formData){
    const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      creator_email: formData.get('email'),
      instructions: formData.get('instructions'),
      image: formData.get('image'),
      creator: formData.get('name'),
    }
    console.log(meal)
    await saveMeal(meal);
    redirect('/meals');
  }