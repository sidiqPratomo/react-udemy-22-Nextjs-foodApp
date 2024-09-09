'use server'

export async function shareMeal(formData){
    const meal = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      creator_email: formData.get('email'),
      instruction: formData.get('instructions'),
      image: formData.get('image'),
      creator: formData.get('name'),
    }
    console.log(meal);
  }